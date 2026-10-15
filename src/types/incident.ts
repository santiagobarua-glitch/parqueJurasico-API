export interface Incident {
    incident_id: number;
    date_time: string;
    description: string;
    dino_id: number | null;
    recint_id: number | null;
}

export interface NewIncident {
    date_time: string;
    description: string;
    dino_id: number;
    recint_id: number;
}