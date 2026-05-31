declare module "pdf-parse";

declare module "pdf-parse" {
  function pdfParse(dataBuffer: Buffer): Promise<{
    text: string;
    numpages: number;
    numrender: number;
    info: any;
    metadata: any;
  }>;
  export default pdfParse;
}
