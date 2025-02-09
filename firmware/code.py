print ("YO")
import board
import time
import busio
from adafruit_lsm6ds.lsm6ds3 import LSM6DS3
import digitalio
import analogio

from adafruit_ble import BLERadio
from adafruit_ble.advertising.standard import ProvideServicesAdvertisement
from adafruit_ble.services.nordic import UARTService
from collections import deque

import json

# ------------------------------
# USER-CONFIGURABLE VARIABLES
# ------------------------------

# Exponential smoothing factor (0 < ALPHA <= 1)
# Smaller ALPHA => smoother but more lag
# Larger ALPHA  => more responsive but less smooth
ALPHA = 0.2

# Acceleration threshold for magnitude (m/s^2)
JERK_THRESHOLD = 10
# Loop delay (seconds) => determines sampling rate
LOOP_DELAY = 0.05

# How long acceleration magnitude must stay above threshold (seconds)
TIME_THRESHOLD = int(3 / LOOP_DELAY)



# ------------------------------
# SETUP
# ------------------------------
# Create a deque that will automatically discard the oldest reading when a new one is added,
# so that its length is always at most TIME_THRESHOLD.
recent_readings = deque([], TIME_THRESHOLD)

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

# Some designs require that you activate the battery measurement circuit.
# Here, we set the READ_BATT_ENABLE pin high to enable it.
read_batt_enable = digitalio.DigitalInOut(board.READ_BATT_ENABLE)
read_batt_enable.direction = digitalio.Direction.OUTPUT
read_batt_enable.value = False  # Set to True to enable battery voltage reading
g = digitalio.DigitalInOut(board.D7)
g.switch_to_output(False)

ru = digitalio.DigitalInOut(board.D0)
ru.switch_to_output(True)

r = digitalio.DigitalInOut(board.D6)
r.switch_to_output(False)


count = 0
def status(good):
    global count
    count = (count + 1) % 20
    r.value = good
    g.value = not good if count > 2 else 1
status(1)

battery_adc = analogio.AnalogIn(board.VBATT)


# The CHARGE_RATE pin controls the charging current.
# In this example, we assume that setting CHARGE_RATE high enables slow charging.
# (If your hardware requires the opposite logic, change True to False.)
charge_rate = digitalio.DigitalInOut(board.CHARGE_RATE)
charge_rate.direction = digitalio.Direction.OUTPUT
charge_rate.value = True  # Set to True to enable slow charging
def get_battery_voltage(adc):
    """
    Convert the raw ADC reading into a battery voltage.

    Assumptions:
    - The ADC provides a 16-bit value (0 to 65535).
    - The ADC reference voltage is 3.3 V.
    - A resistor divider scales the battery voltage (assumed factor is 2).

    Adjust voltage_divider_factor if your circuit uses a different resistor divider.
    """
    voltage_divider_factor = 510/1510  # Adjust as needed
    measured_voltage = (adc.value / 65535) * 3.3 *4.06 / 3.84308
    battery_voltage = measured_voltage / voltage_divider_factor
    return battery_voltage



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


        #all variables visualized with Arduino IDE serial plotter    
        bat_v = get_battery_voltage(battery_adc)

        a = {'smooth_ax': smooth_ax, 'smooth_ay': smooth_ay, 'smooth_az': smooth_az, 
             'jerk_x': jerk_x, 'jerk_y': jerk_y, 'jerk_z': jerk_z, 'smooth_accel': smooth_accel, 
             'smooth_jerk': smooth_jerk, 'time': time.time(), 'bat_v': bat_v, 'above_threshold': above_threshold}
        
        a = json.dumps(a)
        message = "BAT_V:"
        message += str(bat_v)
        message += ",X_Accel:"
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

        #print(message)
        print(a)


        #print("-" * 40)

        # Update previous smoothed acceleration and time for next iteration
        prev_smooth_ax = smooth_ax
        prev_smooth_ay = smooth_ay
        prev_smooth_az = smooth_az
        prev_time = current_time

        # Compute the magnitude of the smoothed acceleration vector
        # Check if the magnitude is above the defined threshold
        recent_readings.append(smooth_jerk > JERK_THRESHOLD)
    # Only evaluate if we have a full window of measurements
    if len(recent_readings) == TIME_THRESHOLD:
        # Count how many of the last TIME_THRESHOLD readings were above threshold
        count_above = sum(recent_readings)  # True counts as 1, False as 0
        if count_above >= (TIME_THRESHOLD / 2):
            above_threshold = True
            status(0)
            # Optionally, print a message:
            # print(f"Jerk was above {JERK_THRESHOLD} in at least 50% of the last {TIME_THRESHOLD} measurements!")
        else:
            above_threshold = False
            status(1)
    else:
        # If we don't have a full window yet, you can decide what to do.
        # For example, you might call status(1) or simply pass.
        above_threshold = False
        status(1)


    # Delay for the next reading (adjusts sampling rate)
    time.sleep(LOOP_DELAY)

