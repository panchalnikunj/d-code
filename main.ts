//% color=#0000FF icon="\uf26c" block="I2C LCD"
namespace I2CLCD {

    let LCD_I2C_ADDR = 0x27 // Default I2C Address, change if needed

    // Send command to LCD
    function lcdCommand(cmd: number) {
        let buf = pins.createBuffer(2)
        buf[0] = 0x00
        buf[1] = cmd
        pins.i2cWriteBuffer(LCD_I2C_ADDR, buf)
        basic.pause(5)
    }

    // Send character to LCD
    function lcdWriteChar(ch: number) {
        let buf = pins.createBuffer(2)
        buf[0] = 0x40
        buf[1] = ch
        pins.i2cWriteBuffer(LCD_I2C_ADDR, buf)
        basic.pause(5)
    }

    // Initialize LCD
    //% block="Initialize LCD at address %addr"
    //% group="LCD Display"
    export function lcdInit(addr: number): void {
        LCD_I2C_ADDR = addr
        basic.pause(50)
        lcdCommand(0x33) // Initialize
        lcdCommand(0x32)
        lcdCommand(0x28) // Function set: 4-bit mode, 2 lines, 5x8 dots
        lcdCommand(0x0C) // Display ON, cursor OFF
        lcdCommand(0x06) // Entry mode set: Move cursor right
        lcdCommand(0x01) // Clear display
        basic.pause(5)
    }

    // Write text to LCD at a given position
    //% block="Write %text on LCD at column %col row %row"
    //% col.min=0 col.max=15 row.min=0 row.max=1
    //% group="LCD Display"
    export function lcdWrite(text: string, col: number, row: number): void {
        let pos = 0x80 + (row * 0x40) + col
        lcdCommand(pos)

        for (let i = 0; i < text.length; i++) {
            lcdWriteChar(text.charCodeAt(i))
        }
    }

    // Clear LCD
    //% block="Clear LCD"
    //% group="LCD Display"
    export function lcdClear(): void {
        lcdCommand(0x01)
        basic.pause(5)
    }

}
