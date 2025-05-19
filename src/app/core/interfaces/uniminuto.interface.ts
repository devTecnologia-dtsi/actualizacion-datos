export interface Login {
    Cn?: string;
    DeparmetNumber?: string;
    Descripcion?: string;
    DisplayName?: string;
    FirstName?: string;
    LastName?: string;
    GidNumber?: string;
    HomeDirectory?: string;
    Mail?: string;
    Pager?: string;
    Sn?: string;
    St?: string;
    Street?: string;
    TelephoneNumber?: string;
    Title?: string;
    Uid?: string;
    UidNumber?: string;
    EmployeType?: string;
    HomePhone?: string;
    L?: null | string;
    useraccountcontrol?: string;
    msds_cloudextensionattribute2?: string;
    "Id"?: string;
}
export interface CorreoBanner {
    code: string;
    body: MailBanner;
    'Content-Type': string;
}
export interface MailBanner {
    correo: string;
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

export interface usuario {
    fondo?: string,
    fecha?: Date;
}
export interface nombres {
    msg?: string,
    nombres: string
}

export interface Academia {
    id?: string;
    programaAcademico?: string;
    programaAcademicoId?: string;
    facultad?: string;
    modalidad?: string;
    semestre?: string;
    sede?: string;
    sedeId?: string;
    descRectoria?: string;
    promedioAcumulado?: string;
    promedioPeriodoActual?: string;
    periodoPrograma?: string;
    CodeNivelAcademico?: string;
    descripcionNivel?: string;
    resultado?: string;
    descResult?: string;
}

export interface UsuarioDA {
    status: string;
    usuario: UsuarioClass | string;
}

export interface UsuarioClass {
    name: string;
    lastname: string;
    pager: number;
    mail: string;
    cn: string;
    givenName: string;

}

export interface Personal {
    Estudiante?: Estudiante;
    ResultadoTransaccion?: ResultadoTransaccion;
}

export interface Estudiante {
    UidEstudiante?: string;
    Email?: string;
    EmailInstitucional?: string;
    Nombre?: string;
    Apellido?: string;
    Foto?: string;
    TelefonoMovil?: string;
    TelefonoResidencia?: string;
    BarrioResidencia?: string;
    Direccion?: Direccion;
    Municipio?: Municipio;
    message?: string;
    response_code?: string
}

export interface Correo {
    asunto: string;
    destinatario: string;
    mensaje: string;
  }
  

export interface Direccion {
    Direccion?: string;
    Tipo?: string;
}

export interface Municipio {
    Id?: string;
    Departamento?: Departamento;
}

export interface Departamento {
    Id?: string;
    Pais?: Pais;
}

export interface Pais {
    Id?: string;
}

export interface ResultadoTransaccion {
    Codigo?: string;
    Mensaje?: string;
}

export interface MunicipioName {
    codigo?: string;
    nombre?: string;
}