export interface Vehicle {
    id: number;
    name: string;
    status: 'at-plant' | 'at-port' | 'on-road' | 'at-border';
    hasGoods: boolean;
    location: string; 
}