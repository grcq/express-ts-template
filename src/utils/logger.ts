import fs from 'fs';
import path from 'path';
import { ROOT_DIR } from '..';

type LogType = "info" | "error" | "success" | "warn" | "debug";

function writeToLogFile(message: string, type: LogType = "info") {
    const date = new Date().toLocaleTimeString();
    const line = `[${date} ${type.toUpperCase()}] ${message}\n`;
    
    const file = `${new Date().toISOString().split("T")[0]}.log`;
    if (!fs.existsSync(path.join(ROOT_DIR, "logs"))) {
        fs.mkdirSync(path.join(ROOT_DIR, "logs"));
    }

    fs.appendFile(path.join(ROOT_DIR, "logs", file), line, (err) => {
        if (err) {
            console.log(`Failed to write log to file: ${err.message}`);
        }
    });
}

export default {
    info: (message: string) => {
        const date = new Date().toLocaleString("en-GB").replace(", ", " ");
        console.log(`\x1b[36m[${date} INFO] \x1b[0m ${message}`);

        writeToLogFile(message, "info");
    },
    error: (message: string) => {
        const date = new Date().toLocaleString("en-GB").replace(", ", " ");
        console.log('\x1b[31m[%s ERROR] \x1b[0m %s', date, message);

        writeToLogFile(message, "error");
    },
    success: (message: string) => {
        const date = new Date().toLocaleString("en-GB").replace(", ", " ");
        console.log('\x1b[32m[%s SUCCESS]\x1b[0m %s', date, message);

        writeToLogFile(message, "success");
    },
    warn: (message: string) => {
        const date = new Date().toLocaleString("en-GB").replace(", ", " ");
        console.log('\x1b[33m[%s WARNING]\x1b[0m %s', date, message);

        writeToLogFile(message, "warn");
    },
    debug: (message: string) => {
        if (!process.env.DEBUG_MODE) return;
        
        const date = new Date().toLocaleString("en-GB").replace(", ", " ");
        console.log('\x1b[34m[%s DEBUG] \x1b[0m %s', date, message);

        writeToLogFile(message, "debug");
    }
}