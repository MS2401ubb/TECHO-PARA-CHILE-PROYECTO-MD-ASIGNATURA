import { EntitySchema } from 'typeorm';

export default new EntitySchema({
  name: 'TareasValidacionJornada',
  tableName: 'tareas_validacion_jornada',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    descripcion: {
      type: 'varchar',
      length: 500,
      nullable: false,
    },
    estado: {
      type: 'enum',
      enum: ['PENDIENTE', 'COMPLETADO'],
      default: 'PENDIENTE',
    },
    observaciones: {
      type: 'text',
      nullable: true,
    },
    // Trazabilidad temporal
    fecha_creada: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    },
    fecha_completado: {
      type: 'timestamp',
      nullable: true,
    },
    rutJefeQueCompletó: {
      type: 'varchar',
      length: 15,
      nullable: true,
    },
    // Bloqueo de edición
    confirmado: {
      type: 'boolean',
      default: false,
    },
    id_jornada: {
      type: 'int',
      nullable: false,
    },
  },
  relations: {
    jornada: {
      target: 'Jornada',
      type: 'many-to-one',
      joinColumn: { name: 'id_jornada' },
      onDelete: 'CASCADE',
    },
  },
});
