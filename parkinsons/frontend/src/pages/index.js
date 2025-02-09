import React, { useState, useEffect, useRef } from "react";
import { Container, AppBar, Box, Button } from "@mui/material";
import Navbar from "../components/Navbar";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import TremorChart from "../components/TremorChart";

const Home = () => {
  const [date, setDate] = useState(new Date());
  const [bluetoothDeviceName, setBluetoothDeviceName] = useState("");
  const lastMessageTimeRef = useRef(Date.now());
  let bluetoothDevice;
  let characteristic;

  const handleNotification = (event) => {
    lastMessageTimeRef.current = Date.now();
    console.log(event);
    setBluetoothDeviceName(bluetoothDevice.name); // TODO: maybe remove, this might trash performance, todo see
    console.log(bluetoothDevice);

  }
  useEffect(() => {
    const timerInterval = setInterval(() => {
      const timeSinceLastMessage = Date.now() - lastMessageTimeRef.current;
      if (timeSinceLastMessage > 500) {
        setBluetoothDeviceName("");
      }
    }, 500);

    return () => clearInterval(timerInterval);
  }, []);

  const connectBluetooth = () => {
    // Example uses the Nordic UART Service (NUS).
    // Change the service/characteristic UUIDs as required for your device.
    const NUS_SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
    const NUS_CHARACTERISTIC_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e'; // TX characteristic

    if (!navigator.bluetooth) {
      alert('Web Bluetooth is not supported in this browser.');
      return;
    }

    navigator.bluetooth.requestDevice({
      filters: [{ services: [NUS_SERVICE_UUID] }]
    })
      .then(device => {
        bluetoothDevice = device;
        console.log('Connecting to GATT Server...');
        return device.gatt.connect();
      })
      .then(server => {
        console.log('Getting Primary Service...');
        return server.getPrimaryService(NUS_SERVICE_UUID);
      })
      .then(service => {
        console.log('Getting Characteristic...');
        return service.getCharacteristic(NUS_CHARACTERISTIC_UUID);
      })
      .then(char => {
        characteristic = char;
        console.log('Starting Notifications...');
        return characteristic.startNotifications();
      })
      .then(() => {
        characteristic.addEventListener('characteristicvaluechanged', handleNotification);
        console.log('Notifications started. Listening for data...');
        setBluetoothDeviceName(bluetoothDevice.name);
        console.log(bluetoothDeviceName);
      })
      .catch(error => {
        console.error('Bluetooth Error: ', error);
      });

  }



  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  return (
    <>
      <AppBar position="static">
        <Navbar />
      </AppBar>
      <Container
        maxWidth="md"
        style={{ textAlign: "center", marginTop: "2rem" }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          style={{ width: "100%" }}
        >
          <Box
            style={{
              flex: 1, // Takes up 1/3 of the space
              maxWidth: "33%", // Ensure it doesn't exceed a third of the container's width
              padding: "1rem",
            }}
          >
            <Calendar
              onChange={handleDateChange}
              value={date}
              style={{
                width: "100%", // Fill width
                height: "100%", // Fill height
              }}
            />
          </Box>
          <Box
            style={{
              flex: 2, // Right section 2/3
              maxWidth: "66%",
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "80vh", // Same height as left section
            }}
          >
            {
              /* Top Section (inside the right section) */
            }
            <Box
              style={{
                flex: 1, // Takes up part of the vertical space
                alignItems: "center",
                marginBottom: "1rem",
                border: "1px solid #ccc",
                padding: "1rem",

                
                  
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: bluetoothDeviceName ? "flex-start" : "center",
                textAlign: "center",
              }}
            >
              {
                bluetoothDeviceName ?
                  <div>
                    <Button onClick={connectBluetooth}>{"Connected to " + (bluetoothDeviceName ? bluetoothDeviceName : "none")}</Button>
                    <Box bgcolor="white"></Box>
                  </div>
                  :
                  <Button size="large" sx={{ fontSize: '20pt' }} onClick={connectBluetooth}>{"Please connect to the device"}</Button>
              }
            </Box>

             {/* Bottom Box: Long-term data (Place your chart here) */}
             <Box
              style={{
                flex: 1,
                border: "1px solid #ccc",
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
                minHeight: "500px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TremorChart />
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Home;
