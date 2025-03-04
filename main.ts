//% color=#333333 icon="\uf2db" block="Bit-Z"
namespace dCode {


    //% group="Car Controls"
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