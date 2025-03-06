//% color=#0000FF icon="\uf26c" block="I2C LCD"
namespace I2CLCD {

    let LCD_I2C_ADDR = 0x27; // Default LCD I2C Address (Change if needed)

    // Send command to LCD
    function lcdCommand(cmd: number) {
        let buf = pins.createBuffer(2);
        buf[0] = 0x00;
        buf[1] = cmd;
        pins.i2cWriteBuffer(LCD_I2C_ADDR, buf);
        basic.pause(5);
    }

    // Send character data to LCD
    function lcdWriteChar(ch: number) {
        let buf = pins.createBuffer(2);
        buf[0] = 0x40;
        buf[1] = ch;
        pins.i2cWriteBuffer(LCD_I2C_ADDR, buf);
        basic.pause(5);
    }

    //% block="Initialize LCD at address %addr"
    //% group="LCD Display"
    export function lcdInit(addr: number): void {
        LCD_I2C_ADDR = addr;
        basic.pause(50);
        lcdCommand(0x33);
        lcdCommand(0x32);
        lcdCommand(0x28);
        lcdCommand(0x0C);
        lcdCommand(0x06);
        lcdCommand(0x01); // Clear display
        basic.pause(5);
    }

    //% block="Write %text on LCD at column %col row %row"
    //% col.min=0 col.max=15 row.min=0 row.max=1
    //% group="LCD Display"
    export function lcdWrite(text: string, col: number, row: number): void {
        let pos = 0x80 + (row * 0x40) + col;
        lcdCommand(pos);

        for (let i = 0; i < text.length; i++) {
            lcdWriteChar(text.charCodeAt(i));
        }
    }

    //% block="Clear LCD"
    //% group="LCD Display"
    export function lcdClear(): void {
        lcdCommand(0x01);
        basic.pause(5);
    }

    //% block="Turn LCD backlight %state"
    //% state.shadow="toggleOnOff"
    //% group="LCD Display"
    export function lcdBacklight(state: boolean): void {
        let buf = pins.createBuffer(1);
        buf[0] = state ? 0x08 : 0x00;
        pins.i2cWriteBuffer(LCD_I2C_ADDR, buf);
    }
}
