print ("YO")
import board
import time
import busio
from adafruit_lsm6ds.lsm6ds3 import LSM6DS3
import digitalio

from adafruit_ble import BLERadio
from adafruit_ble.advertising.standard import ProvideServicesAdvertisement
from adafruit_ble.services.nordic import UARTService

import json

# ------------------------------
# USER-CONFIGURABLE VARIABLES
# ------------------------------

# Exponential smoothing factor (0 < ALPHA <= 1)
# Smaller ALPHA => smoother but more lag
# Larger ALPHA  => more responsive but less smooth
ALPHA = 0.2

# Acceleration threshold for magnitude (m/s^2)
ACCEL_THRESHOLD = 1.0

# How long acceleration magnitude must stay above threshold (seconds)
TIME_THRESHOLD = 3.0

# Loop delay (seconds) => determines sampling rate
LOOP_DELAY = 0.1

# ------------------------------
# SETUP
# ------------------------------
dpwr = digitalio.DigitalInOut(board.IMU_PWR)
dpwr.direction = digitalio.Direction.OUTPUT
dpwr.value = 1
time.sleep(.1)
# Create I2C interface
print(board.IMU_SCL, board.IMU_SDA)
i2c = busio.I2C(board.IMU_SCL, board.IMU_SDA)
print("I2c initialized")
# Initialize the LSM6DS3 sensor using the Adafruit CircuitPython LSM6DS library
sensor = LSM6DS3(i2c)


# Initialize BLE radio and create a UART service.
ble = BLERadio()
uart = UARTService()
advertisement = ProvideServicesAdvertisement(uart)

# Start advertising so a BLE central (e.g., smartphone) can connect.
ble.start_advertising(advertisement)
print("Advertising BLE UART service...")


# Initialize smoothed acceleration values (for X, Y, and Z)
smooth_ax = 0.0
smooth_ay = 0.0
smooth_az = 0.0

# Variables to store previous smoothed acceleration for jerk calculation
prev_smooth_ax = 0.0
prev_smooth_ay = 0.0
prev_smooth_az = 0.0

# Record the initial time for the loop
prev_time = time.monotonic()

# Variables for the threshold timing check
above_threshold = False
above_threshold_start_time = 0.0

# ------------------------------
# MAIN LOOP
# ------------------------------
while True:
    # Read current (raw) acceleration in m/s^2
    ax, ay, az = sensor.acceleration

    # Get current time and calculate the time difference (dt)
    current_time = time.monotonic()
    dt = current_time - prev_time

    # Exponential smoothing of acceleration on each axis
    smooth_ax = ALPHA * ax + (1 - ALPHA) * smooth_ax
    smooth_ay = ALPHA * ay + (1 - ALPHA) * smooth_ay
    smooth_az = ALPHA * az + (1 - ALPHA) * smooth_az

    smooth_accel = (smooth_ax ** 2 + smooth_ay ** 2 + smooth_az ** 2) ** 0.5 - 10

    # Compute jerk (rate of change of smoothed acceleration) if dt is valid
    if dt > 0:
        jerk_x = (smooth_ax - prev_smooth_ax) / dt
        jerk_y = (smooth_ay - prev_smooth_ay) / dt
        jerk_z = (smooth_az - prev_smooth_az) / dt

        smooth_jerk = (jerk_x ** 2 + jerk_y ** 2 + jerk_z ** 2) ** 0.5


        # Print smoothed acceleration and computed jerk
    
    #    print("Smoothed Accel (m/s^2): x={:.3f}, y={:.3f}, z={:.3f}".format(smooth_ax, smooth_ay, smooth_az))
    #   print("Jerk (m/s^3):           x={:.3f}, y={:.3f}, z={:.3f}".format(jerk_x, jerk_y, jerk_z))



    status = 0

    # Check if the magnitude is above the defined threshold
    if smooth_accel > ACCEL_THRESHOLD:
        if not above_threshold:
            # Just crossed the threshold: start the timer
            above_threshold = True
            above_threshold_start_time = current_time
            status = 0
        else:
            # Already above threshold; check how long it has been above
            elapsed_above = current_time - above_threshold_start_time
            if elapsed_above >= TIME_THRESHOLD:
                pass
                status = 1
    else:
        # Reset the threshold timing if the magnitude drops below the threshold
        above_threshold = False

        #all variables visualized with Arduino IDE serial plotter    

        a = {'smooth_ax': smooth_ax, 'smooth_ay': smooth_ay, 'smooth_az': smooth_az, 
             'jerk_x': jerk_x, 'jerk_y': jerk_y, 'jerk_z': jerk_z, 'smooth_accel': smooth_accel, 
             'smooth_jerk': smooth_jerk, 'time': time.time(), 'status': status}
        
        
        a = json.dumps(a)
        
        message = "X_Accel:"
        message += str(smooth_ax)

        message += ",Y_Accel:"
        message += str(smooth_ay)

        message += ",Z_Accel:"
        message += str(smooth_az)

        message += ",X_Jerk:"
        message += str(jerk_x)

        message += ",Y_Jerk:"
        message += str(jerk_y)

        message += ",Z_Jerk:"
        message += str(jerk_z)


        message += ",accel:"
        message += str(smooth_accel)

        message += ",jerk:"
        message += str(smooth_jerk)


        message += ",dt:{:.3f}".format(dt)

        if ble.connected:
            uart.write(a.encode("utf-8"))

        print(message)

        #print("-" * 40)

        # Update previous smoothed acceleration and time for next iteration
        prev_smooth_ax = smooth_ax
        prev_smooth_ay = smooth_ay
        prev_smooth_az = smooth_az
        prev_time = current_time


    # Delay for the next reading (adjusts sampling rate)
    time.sleep(LOOP_DELAY)

