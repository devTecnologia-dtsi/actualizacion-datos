export interface Registraduria {
    EstadoConsulta: EstadoConsulta;
}

export interface EstadoConsulta {
    Codigo:            number;
    DatosCedulas:      DatosCedula[];
    Descripcion:       string;
    fechaHoraConsulta: Date;
    numeroControl:     number;
}

export interface DatosCedula {
    anoResolucion:          string;
    codError:               number;
    departamentoExpedicion: string;
    estadoCedula:           number;
    fechaAfectacion:        string;
    fechaDefuncion:         string;
    fechaExpedicion:        string;
    fechaReferencia:        string;
    informante:             string;
    municipioExpedicion:    string;
    numResolucion:          string;
    particula:              string;
    primerApellido:         string;
    primerNombre:           string;
    segundoApellido:        string;
    segundoNombre:          string;
    serial:                 string;
    NumeroIdentificacion:   number;
}