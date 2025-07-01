import { Request, Response } from 'express';
import { 
  ConsultaMedica, 
  CreateConsultaRequest, 
  UpdateConsultaRequest,
  ApiResponse, 
  PaginatedResponse,
  EstadoConsulta 
} from '../types';

// Simulamos una base de datos en memoria
class ConsultaRepository {
  private consultas: ConsultaMedica[] = [];
  private nextId = 1;

  async findAll(): Promise<ConsultaMedica[]> {
    return this.consultas;
  }

  async findById(id: string): Promise<ConsultaMedica | null> {
    return this.consultas.find(c => c.id === id) || null;
  }

  async findByPacienteId(pacienteId: string): Promise<ConsultaMedica[]> {
    return this.consultas.filter(c => c.pacienteId === pacienteId);
  }

  async create(consultaData: CreateConsultaRequest): Promise<ConsultaMedica> {
    const nuevaConsulta: ConsultaMedica = {
      id: this.nextId.toString(),
      ...consultaData,
      fecha: new Date(consultaData.fecha),
      sintomas: consultaData.sintomas || [],
      signosVitales: consultaData.signosVitales || {},
      estado: EstadoConsulta.PROGRAMADA
    };
    
    this.consultas.push(nuevaConsulta);
    this.nextId++;
    return nuevaConsulta;
  }

  async update(id: string, updateData: UpdateConsultaRequest): Promise<ConsultaMedica | null> {
    const index = this.consultas.findIndex(c => c.id === id);
    if (index === -1) return null;

    // Convertir fechas si están presentes
    const processedUpdateData: any = { ...updateData };
    if (processedUpdateData.proximaCita) {
      processedUpdateData.proximaCita = new Date(processedUpdateData.proximaCita);
    }

    this.consultas[index] = { ...this.consultas[index], ...processedUpdateData };
    return this.consultas[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.consultas.findIndex(c => c.id === id);
    if (index === -1) return false;

    this.consultas.splice(index, 1);
    return true;
  }

  async findByDateRange(fechaInicio: Date, fechaFin: Date): Promise<ConsultaMedica[]> {
    return this.consultas.filter(c => 
      c.fecha >= fechaInicio && c.fecha <= fechaFin
    );
  }

  async findByEstado(estado: EstadoConsulta): Promise<ConsultaMedica[]> {
    return this.consultas.filter(c => c.estado === estado);
  }
}

const consultaRepository = new ConsultaRepository();

export class ConsultaController {

  async getAllConsultas(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const pacienteId = req.query.pacienteId as string;
      const estado = req.query.estado as EstadoConsulta;
      const fechaInicio = req.query.fechaInicio as string;
      const fechaFin = req.query.fechaFin as string;

      let consultas = await consultaRepository.findAll();

      // Filtros
      if (pacienteId) {
        consultas = await consultaRepository.findByPacienteId(pacienteId);
      }

      if (estado) {
        consultas = consultas.filter(c => c.estado === estado);
      }

      if (fechaInicio && fechaFin) {
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        consultas = consultas.filter(c => c.fecha >= inicio && c.fecha <= fin);
      }

      // Ordenar por fecha (más recientes primero)
      consultas.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());

      // Paginación
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const paginatedConsultas = consultas.slice(startIndex, endIndex);

      const response: ApiResponse<PaginatedResponse<ConsultaMedica>> = {
        success: true,
        data: {
          data: paginatedConsultas,
          total: consultas.length,
          page,
          limit,
          totalPages: Math.ceil(consultas.length / limit)
        }
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Error al obtener consultas'
      };
      res.status(500).json(response);
    }
  }

  async getConsultaById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const consulta = await consultaRepository.findById(id);

      if (!consulta) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Consulta no encontrada'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<ConsultaMedica> = {
        success: true,
        data: consulta
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Error al obtener consulta'
      };
      res.status(500).json(response);
    }
  }

  async createConsulta(req: Request, res: Response): Promise<void> {
    try {
      const consultaData: CreateConsultaRequest = req.body;

      // Validaciones básicas
      if (!consultaData.pacienteId || !consultaData.fecha || !consultaData.motivo || !consultaData.medico) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'PacienteId, fecha, motivo y médico son requeridos'
        };
        res.status(400).json(response);
        return;
      }

      const nuevaConsulta = await consultaRepository.create(consultaData);

      const response: ApiResponse<ConsultaMedica> = {
        success: true,
        data: nuevaConsulta,
        message: 'Consulta creada exitosamente'
      };

      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Error al crear consulta'
      };
      res.status(500).json(response);
    }
  }

  async updateConsulta(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData: UpdateConsultaRequest = req.body;

      const consultaActualizada = await consultaRepository.update(id, updateData);

      if (!consultaActualizada) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Consulta no encontrada'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<ConsultaMedica> = {
        success: true,
        data: consultaActualizada,
        message: 'Consulta actualizada exitosamente'
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Error al actualizar consulta'
      };
      res.status(500).json(response);
    }
  }

  async deleteConsulta(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const eliminada = await consultaRepository.delete(id);

      if (!eliminada) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Consulta no encontrada'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<null> = {
        success: true,
        message: 'Consulta eliminada exitosamente'
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Error al eliminar consulta'
      };
      res.status(500).json(response);
    }
  }

  async getConsultasByPaciente(req: Request, res: Response): Promise<void> {
    try {
      const { pacienteId } = req.params;
      const consultas = await consultaRepository.findByPacienteId(pacienteId);

      // Ordenar por fecha (más recientes primero)
      consultas.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());

      const response: ApiResponse<ConsultaMedica[]> = {
        success: true,
        data: consultas
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Error al obtener consultas del paciente'
      };
      res.status(500).json(response);
    }
  }

  async cambiarEstadoConsulta(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { estado } = req.body;

      if (!Object.values(EstadoConsulta).includes(estado)) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Estado de consulta inválido'
        };
        res.status(400).json(response);
        return;
      }

      const consultaActualizada = await consultaRepository.update(id, { estado });

      if (!consultaActualizada) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Consulta no encontrada'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<ConsultaMedica> = {
        success: true,
        data: consultaActualizada,
        message: `Estado de consulta cambiado a ${estado}`
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Error al cambiar estado de consulta'
      };
      res.status(500).json(response);
    }
  }
}
