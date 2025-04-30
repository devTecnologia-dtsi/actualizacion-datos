export interface errorLogin {
    timestamp: number;
    error: string;
    code: number;
}

export interface successLogin {
    success: string;
    jws: Body;
}

export interface usuario {
    mail: string;
    idBanner: string;
    nombres: string;
}