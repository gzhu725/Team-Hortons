import time
import board
import busio
import adafruit_lsm6ds

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

# Create I2C interface
i2c = busio.I2C(board.SCL, board.SDA)

# Initialize the LSM6DS3 sensor using the Adafruit CircuitPython LSM6DS library
sensor = adafruit_lsm6ds.LSM6DS3(i2c)

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

    # Compute jerk (rate of change of smoothed acceleration) if dt is valid
    if dt > 0:
        jerk_x = (smooth_ax - prev_smooth_ax) / dt
        jerk_y = (smooth_ay - prev_smooth_ay) / dt
        jerk_z = (smooth_az - prev_smooth_az) / dt

        # Print smoothed acceleration and computed jerk
        print("Smoothed Accel (m/s^2): x={:.3f}, y={:.3f}, z={:.3f}".format(smooth_ax, smooth_ay, smooth_az))
        print("Jerk (m/s^3):           x={:.3f}, y={:.3f}, z={:.3f}".format(jerk_x, jerk_y, jerk_z))
        print("dt:                     {:.3f} s".format(dt))
        print("-" * 40)

        # Update previous smoothed acceleration and time for next iteration
        prev_smooth_ax = smooth_ax
        prev_smooth_ay = smooth_ay
        prev_smooth_az = smooth_az
        prev_time = current_time

    # Compute the magnitude of the smoothed acceleration vector
    accel_mag = (smooth_ax**2 + smooth_ay**2 + smooth_az**2) ** 0.5

    # Check if the magnitude is above the defined threshold
    if accel_mag > ACCEL_THRESHOLD:
        if not above_threshold:
            # Just crossed the threshold: start the timer
            above_threshold = True
            above_threshold_start_time = current_time
        else:
            # Already above threshold; check how long it has been above
            elapsed_above = current_time - above_threshold_start_time
            if elapsed_above >= TIME_THRESHOLD:
                print("Acceleration has been above {:.1f} m/s^2 for at least {:.1f} seconds!".format(
                    ACCEL_THRESHOLD, TIME_THRESHOLD
                ))
    else:
        # Reset the threshold timing if the magnitude drops below the threshold
        above_threshold = False

    # Delay for the next reading (adjusts sampling rate)
    time.sleep(LOOP_DELAY)

