import { EntitySchema } from "typeorm";

export default new EntitySchema({
  name: "Reporte",
  tableName: "reportes",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    titulo: {
      type: "varchar",
      length: 150,
    },
    contenido: {
      type: "text",
    },
    areaOrganizacion: {
      type: "varchar",
      length: 50,
      comment: "Voluntarios, Materiales, Viviendas, Jornadas, Logistica u Otro",
    },
    urgencia: {
      type: "varchar",
      length: 30,
      comment: "Baja, Media, Alta o Critica",
    },
    categoria: {
      type: "varchar",
      length: 50,
      comment: "Fin de Jornada, Mensual, Incidente u Otro",
    },
    periodo: {
      type: "varchar",
      length: 50,
      nullable: true,
    },
    estado: {
      type: "varchar",
      length: 30,
      default: "Recibido",
    },
    fechaEnvio: {
      type: "timestamp",
      createDate: true,
    },
  },
  relations: {
    remitente: {
      target: "Usuario",
      type: "many-to-one",
      joinColumn: { name: "rutRemitente" },
      onDelete: "RESTRICT",
    },
  },
});

