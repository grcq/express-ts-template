import express from 'express';
import fs from 'fs';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import logger from './utils/logger';
import Route from './classes/Route';
import Database from './classes/Database';

const SRC_DIR = `${__dirname}`;
const ROOT_DIR = SRC_DIR.replace(/\\/g, "/").split("/").slice(0, -1).join("/");

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const AUTH_KEY = process.env.AUTHORIZATION_TOKEN;
if (!AUTH_KEY) {
    logger.warn("No authorization token found in .env file. This means that anyone can access your API. It's recommended to use an authorization token.");
} else {
    app.use((req, res, next) => {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({
                error: "Unauthorized"
            });
        }

        if (token !== AUTH_KEY) {
            return res.status(403).json({
                error: "Forbidden"
            });
        }

        next();
    });
}

function getRoutes() {
    const fullRoutes = [];
    const routes = fs.readdirSync(`${SRC_DIR}/routes`);
    for (const route of routes) {
        // check if dir
        if (fs.lstatSync(`${SRC_DIR}/routes/${route}`).isDirectory()) {
            const subRoutes = fs.readdirSync(`${SRC_DIR}/routes/${route}`);
            for (const subRoute of subRoutes) {
                fullRoutes.push(`${route}/${subRoute}`);
            }
        } else {
            if (!route.endsWith(".ts") && !route.endsWith(".js")) continue;
            fullRoutes.push(route);
        }
        
    }

    return fullRoutes;
}

async function load() {
    logger.info("Setting up database...");
    const db = new Database();
    // create tables and do stuff with db here
    db.close();

    logger.info("Loading routes...");
    const routes = getRoutes();
    for (const route of routes) {
        const r = (await import(`${SRC_DIR}/routes/${route}`)).default;
        const routeInstance = new r();
        if (!(routeInstance instanceof Route)) {
            logger.error(`Route ${route} does not extend Route class`);
            continue;
        }

        const method = routeInstance.method.toLowerCase();
        let path = routeInstance.path || `/${route.split(".")[0]}`;
        if (!path.startsWith("/")) path = `/${path}`;

        switch (method) {
            case "get":
                app.get(path, routeInstance.execute);
                break;
            case "post":
                app.post(path, routeInstance.execute);
                break;
            case "put":
                app.put(path, routeInstance.execute);
                break;
            case "delete":
                app.delete(path, routeInstance.execute);
                break;
            case "patch":
                app.patch(path, routeInstance.execute);
                break;
            default:
                logger.error(`Method ${method} is not supported`);
                break;
        }

        logger.info(`Loaded route ${method.toUpperCase()}: ${path}`);
        
    }
    
}

const port = process.env.SERVER_PORT || 3000;
app.listen(port, () => {
    logger.info(`Server is now running on port ${port} (URL: http://127.0.0.1:${port}/) 🚀`);
})

load();

export {
    ROOT_DIR
};