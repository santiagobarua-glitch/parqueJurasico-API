export interface Incident {
    incident_id: number;
    date_time: number;
    description: string;
    dino_id?: number;
    recint_id: number;
}

export interface NewIncident {
    date_time: number;
    description: string;
    dino_id?: number;
    recint_id: number;
}