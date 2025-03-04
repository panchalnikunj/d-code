//% color=#000000 icon="\uf2db" block="Bit-Z"
namespace dCode {









    // CAR SECTION 🚗
    //% group="Car"
    //% blockId=car_move block="Car Move %direction with speed %speed"
    //% direction.shadow="dropdown" direction.defl="Forward"
    //% speed.min=0 speed.max=1023
    export function carMove(direction: string, speed: number): void {
        let pwmSpeed = Math.map(speed, 0, 1023, 0, 255); // Scale speed for PWM

        if (direction == "Forward") {
            pins.analogWritePin(AnalogPin.P12, pwmSpeed);
            pins.analogWritePin(AnalogPin.P13, 0);
            pins.analogWritePin(AnalogPin.P14, pwmSpeed);
            pins.analogWritePin(AnalogPin.P15, 0);
        } else if (direction == "Backward") {
            pins.analogWritePin(AnalogPin.P12, 0);
            pins.analogWritePin(AnalogPin.P13, pwmSpeed);
            pins.analogWritePin(AnalogPin.P14, 0);
            pins.analogWritePin(AnalogPin.P15, pwmSpeed);
        } else if (direction == "Left") {
            pins.analogWritePin(AnalogPin.P12, 0);
            pins.analogWritePin(AnalogPin.P13, pwmSpeed);
            pins.analogWritePin(AnalogPin.P14, pwmSpeed);
            pins.analogWritePin(AnalogPin.P15, 0);
        } else if (direction == "Right") {
            pins.analogWritePin(AnalogPin.P12, pwmSpeed);
            pins.analogWritePin(AnalogPin.P13, 0);
            pins.analogWritePin(AnalogPin.P14, 0);
            pins.analogWritePin(AnalogPin.P15, pwmSpeed);
        } else if (direction == "Stop") {
            pins.analogWritePin(AnalogPin.P12, 0);
            pins.analogWritePin(AnalogPin.P13, 0);
            pins.analogWritePin(AnalogPin.P14, 0);
            pins.analogWritePin(AnalogPin.P15, 0);
        }
    }

    //% blockId=car_lights block="turn %state car lights"
    //% state.defl=CarLightState.On
    export function carLights(state: CarLightState): void {
        pins.digitalWritePin(DigitalPin.P3, state == CarLightState.On ? 1 : 0);
    }

    // ENUMS
    //% blockId=car_direction_enum block="%direction"
    //% blockHidden=true
    export enum CarDirection {
        //% block="Forward"
        Forward,
        //% block="Stop"
        Stop
    }

    //% blockId=steering_enum block="%direction"
    //% blockHidden=true
    export enum Steering {
        //% block="Left"
        Left,
        //% block="Right"
        Right
    }

    //% blockId=car_light_enum block="%state"
    //% blockHidden=true
    export enum CarLightState {
        //% block="On"
        On,
        //% block="Off"
        Off
    }




    //% group="Actuators"
    //% blockId=servo_motor block="set servo %servo to %angle°"
    //% angle.min=0 angle.max=180
    //% servo.defl=Servo.S1
    export function setServoAngle(servo: Servo, angle: number): void {
        let pin = (servo == Servo.S1) ? AnalogPin.P6 : AnalogPin.P7;
        let pulseWidth = (angle * 2000) / 180 + 500; // Convert angle (0-180) to pulse width (500-2500µs)
        pins.servoSetPulse(pin, pulseWidth);
    }

    //% blockId=servo_enum block="%servo"
    //% blockHidden=true
    export enum Servo {
        //% block="S1"
        S1 = 0,
        //% block="S2"
        S2 = 1
    }



    //% group="Sensors"
    //% blockId=dht11_sensor block="read DHT11 %dhtData at pin %pin"
    //% pin.defl=DigitalPin.P2
    export function readDHT11(dhtData: DHT11Data, pin: DigitalPin): number {
        let buffer: number[] = [];
        let startTime: number;
        let signal: number;

        // Start signal
        pins.digitalWritePin(pin, 0);
        basic.pause(18);
        pins.digitalWritePin(pin, 1);
        control.waitMicros(40);
        pins.setPull(pin, PinPullMode.PullUp);

        // Wait for response
        while (pins.digitalReadPin(pin) == 1);
        while (pins.digitalReadPin(pin) == 0);
        while (pins.digitalReadPin(pin) == 1);

        // Read 40-bit data (5 bytes)
        for (let i = 0; i < 40; i++) {
            while (pins.digitalReadPin(pin) == 0);
            startTime = control.micros();
            while (pins.digitalReadPin(pin) == 1);
            signal = control.micros() - startTime;
            buffer.push(signal > 40 ? 1 : 0);
        }

        // Convert data
        let humidity = (buffer.slice(0, 8).reduce((a, b) => (a << 1) | b, 0));
        let temperature = (buffer.slice(16, 24).reduce((a, b) => (a << 1) | b, 0));

        return dhtData == DHT11Data.Temperature ? temperature : humidity;
    }

    //% blockId=dht11_data block="%dhtData"
    //% blockHidden=true
    export enum DHT11Data {
        //% block="Temperature (°C)"
        Temperature = 0,
        //% block="Humidity (%)"
        Humidity = 1
    }


    //% group="Sensors"
    /**
     * Measures distance in centimeters using an HC-SR04 sensor.
     * @param trigPin The trigger pin
     * @param echoPin The echo pin
     */
    //% blockId=ultrasonic_distance block="measure distance trig %trigPin| echo %echoPin"
    //% trigPin.defl=DigitalPin.P0 echoPin.defl=DigitalPin.P1
    export function measureDistance(trigPin: DigitalPin, echoPin: DigitalPin): number {
        pins.digitalWritePin(trigPin, 0);
        control.waitMicros(2);
        pins.digitalWritePin(trigPin, 1);
        control.waitMicros(10);
        pins.digitalWritePin(trigPin, 0);

        let duration = pins.pulseIn(echoPin, PulseValue.High, 23000);
        let distance = duration / 58;

        return distance > 400 ? 400 : distance; // Limit to 400 cm (sensor range)
    }

    //% group="Sensors"
    //% blockId=analog_sensor block="read Analog sensor at pin %pin"
    //% pin.defl=AnalogPin.P0
    export function readAnalogSensor(pin: AnalogPin): number {
        return pins.analogReadPin(pin);
    }


    //% group="Sensors"
    //% blockId=digital_sensor block="read Digital sensor at pin %pin"
    //% pin.defl=DigitalPin.P1
    export function readDigitalSensor(pin: DigitalPin): number {
        return pins.digitalReadPin(pin);
    }




    //% group="LCD Display"
    //% blockId=lcd_initialize block="initialize LCD at address %addr"
    //% addr.defl=39
    export function initializeLCD(addr: number): void {
        let i2cAddr = addr;

        basic.pause(50);
        sendCommand(i2cAddr, 0x33); // Initialize
        sendCommand(i2cAddr, 0x32);
        sendCommand(i2cAddr, 0x28);
        sendCommand(i2cAddr, 0x0C);
        sendCommand(i2cAddr, 0x06);
        sendCommand(i2cAddr, 0x01); // Clear display
        basic.pause(5);
    }

    function sendCommand(addr: number, cmd: number): void {
        pins.i2cWriteNumber(addr, cmd, NumberFormat.UInt8LE, false);
        basic.pause(5);
    }



    //% group="LCD Display"
    //% blockId=lcd_print block="LCD print %text at column %col row %row"
    //% col.min=0 col.max=15 row.min=0 row.max=1
    export function lcdPrint(text: string, col: number, row: number): void {
        let addr = 39; // Change if needed
        let pos = 0x80 + (row * 0x40) + col;

        sendCommand(addr, pos);
        for (let i = 0; i < text.length; i++) {
            sendCommand(addr, text.charCodeAt(i));
        }
    }


    //% group="LCD Display"
    //% blockId=lcd_clear block="clear LCD"
    export function lcdClear(): void {
        let addr = 39; // Change if needed
        sendCommand(addr, 0x01);
    }



}