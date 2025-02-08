#!/usr/bin/env python3
import serial
import random
import time

# Configure your Bluetooth serial port and baud rate.
# Replace '/dev/rfcomm0' with your device's path if different.
SERIAL_PORT = '/dev/rfcomm0'
BAUDRATE = 9600

def main():
    try:
        # Open the serial connection
        ser = serial.Serial(SERIAL_PORT, BAUDRATE, timeout=.1)
        print(f"Connected to {SERIAL_PORT} at {BAUDRATE} baud.")
    except Exception as e:
        print(f"Error opening serial port: {e}")
        return

    try:
        while True:
            # Generate a random float between 0.0 and 1.0
            number = random.random()  
            # Format the number as a string; you can adjust the precision as needed.
            message = f"{number:.4f}\n"
            
            # Write the message to the serial port.
            ser.write(message.encode('utf-8'))
            print(f"Sent: {message.strip()}")

            # Wait for a second before sending the next number.
            time.sleep(1)
    except KeyboardInterrupt:
        print("Script interrupted by user.")
    finally:
        ser.close()
        print("Serial connection closed.")

if __name__ == "__main__":
    main()

