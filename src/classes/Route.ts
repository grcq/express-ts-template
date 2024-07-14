export type Method = "get" | "post" | "put" | "delete" | "patch";

export default abstract class Route {
    public abstract method: Method;
    public abstract execute(req: any, res: any): void;
    public path?: string;
}