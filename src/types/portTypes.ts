export type portStatus = "Active" | "Inactive";

export interface PortItems {
    name: string
    port: number
    status?: portStatus
}