import Route, { Method } from "~/classes/Route";

export default class extends Route {
    public method: Method = "get";

    public execute(req: any, res: any) {
        res.status(200).json({
            message: "Test route"
        });
    }
}