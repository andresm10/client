export interface Mail{
    from?: string;
    subject: string;
    to: string;
    body: string;
    provider:string;
}