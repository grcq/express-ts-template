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
    info: (message: any, ...params: any) => {
        const date = new Date().toLocaleString("en-GB").replace(", ", " ");
        console.log(`\x1b[36m[${date} INFO] \x1b[0m ${message}`, ...params);

        writeToLogFile(message, "info");
    },
    error: (message: any, ...params: any) => {
        const date = new Date().toLocaleString("en-GB").replace(", ", " ");
        console.log(`\x1b[31m[${date} ERROR] \x1b[0m ${message}`, ...params);

        writeToLogFile(message, "error");
    },
    success: (message: any, ...params: any) => {
        const date = new Date().toLocaleString("en-GB").replace(", ", " ");
        console.log(`\x1b[32m[${date} SUCCESS] \x1b[0m ${message}`, ...params);

        writeToLogFile(message, "success");
    },
    warn: (message: any, ...params: any) => {
        const date = new Date().toLocaleString("en-GB").replace(", ", " ");
        console.log(`\x1b[33m[${date} WARN] \x1b[0m ${message}`, ...params);

        writeToLogFile(message, "warn");
    },
    debug: (message: any, ...params: any) => {
        if (!process.env.DEBUG_MODE || process.env.DEBUG_MODE == "false") return;

        const date = new Date().toLocaleString("en-GB").replace(", ", " ");
        console.log(`\x1b[35m[${date} DEBUG] \x1b[0m ${message}`, ...params);

        writeToLogFile(message, "debug");
    }
}
