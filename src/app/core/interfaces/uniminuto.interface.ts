export interface Residencia {
    codigo: string;
    nombre: string;
}

export interface datosAcademicos {
    personales: Personales;
    salida: Salida[];
}

export interface Personales {
    SISBEN: string;
    NIVELSISBEN: null;
    GENERO: string;
    EMAIL: string;
    PAIS: string;
    PAISID: string;
    NUMEROVISA: string;
    NUMEROIDENTIFICACION: string;
    FECHANACIMIENTO: number;
    TIPOSANGRE: string;
    FECHAACTUALIZACION: number;
    BARRIORESIDENCIA: string;
    SNOMBRE: string;
    DIRECCIONRESIDENCIA: string;
    ETNIA: string;
    TIPODIRECCION: string;
    ESTRATO: number;
    EMAILESTU: string;
    RESULTADO: string;
    MUNICIPIO: string;
    TELEFONORESIDENCIA: string;
    MUNICIPIOID: string;
    ESTADOCIVIL: string;
    TIPODISCAPACIDAD: string;
    AREAMOVIL: null;
    AREARESIDENCIA: null;
    APELLIDOS: string;
    DEPARTAMENTOID: string;
    DEPARTAMENTO: string;
    TELEFONOMOVIL: string;
    DESCRESULT: string;
    URLFOTO: string;
}

export interface Salida {
    PROGRAMAACADEMICOID: string;
    SEDEID: string;
    DESCRECTORIA: string;
    PROMEDIOACUMULADO: number;
    PROGRAMAACADEMICO: string;
    DESCRIPCIONNIVEL: string;
    RESULTADO: string;
    PERIODOPROGRAMA: string;
    PROMEDIOPERIODOACTUAL: number;
    FACULTAD: string;
    SEDE: string;
    SEMESTRE: number;
    DESCRESULT: string;
    CODENIVELACADEMICO: string;
    ID: string;
    MODALIDAD: string;
}

export interface PutActualizacion {
    timestamp?: number,
    error?: string,
    code: number,
    resultado?: string,
}


export interface DireccionModal {
    via: string,
    seccionUno: string,
    seccionDos: string,
    seccionTres: string,
    seccionCuatro: string,
    seccionCinco: string,
    seccionSeis: string,
    seccionSiete: string,

}

export interface Paises {
    id: string;
    nombre: string;
    prefijo: string;
    nombre_banner: string;
    prefijo_banner: string;
}

export interface token {
    aud: string;
    estado: number;
    exp: string;
    idBanner: string;
    iss: string;
    mail: string;
    nbf: number;
    nombres: string;
    sub: string;
    success: string;
}

export interface DatosCedulas {
    segundoNombre?: string;
    primerApellido?: string;
    primerNombre?: string;
    fechaDefuncion?: string;
    segundoApellido?: string;
    departamentoExpedicion?: string;
    estadoCedula?: string;
    numResolucion?: string;
    particula?: string;
    informante?: string;
    anoResolucion?: string;
    fechaExpedicion?: string;
    serial?: string;
    municipioExpedicion?: string;
    codError: string;
    NumeroIdentificacion: string;
}

export interface nombres {
    msg?: string,
    nombres: string
}


export interface Direccion {
    Direccion?: string;
    Tipo?: string;
}

export interface Departamentos {
    banner_id?: string;
    nombre?: string;
}


export interface ResultadoTransaccion {
    Codigo?: string;
    Mensaje?: string;
}

export interface Municipios {
    banner_id?: string;
    nombre?: string;
}