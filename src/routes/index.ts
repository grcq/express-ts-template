import Route, { Method } from "~/classes/Route";

export default class extends Route {
    public method: Method = "get";
    public path: string = "/";

    public execute(req: any, res: any) {
        res.status(200).json({
            message: "Hello World!"
        });
    }
}