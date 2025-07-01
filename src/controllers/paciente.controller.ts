import { Request, Response } from 'express';
import { 
  Paciente, 
  CreatePacienteRequest, 
  ApiResponse, 
  PaginatedResponse,
  TipoDocumento,
  Sexo 
} from '../types';

// Simulamos una base de datos en memoria (deberías reemplazar esto con tu base de datos real)
class PacienteRepository {
  private pacientes: Paciente[] = [];
  private nextId = 1;

  async findAll(): Promise<Paciente[]> {
    return this.pacientes.filter(p => p.activo);
  }

  async findById(id: string): Promise<Paciente | null> {
    return this.pacientes.find(p => p.id === id && p.activo) || null;
  }

  async create(pacienteData: CreatePacienteRequest): Promise<Paciente> {
    const nuevoPaciente: Paciente = {
      id: this.nextId.toString(),
      ...pacienteData,
      fechaNacimiento: new Date(pacienteData.fechaNacimiento),
      fechaRegistro: new Date(),
      activo: true
    };
    
    this.pacientes.push(nuevoPaciente);
    this.nextId++;
    return nuevoPaciente;
  }

  async update(id: string, updateData: Partial<Paciente>): Promise<Paciente | null> {
    const index = this.pacientes.findIndex(p => p.id === id && p.activo);
    if (index === -1) return null;

    this.pacientes[index] = { ...this.pacientes[index], ...updateData };
    return this.pacientes[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.pacientes.findIndex(p => p.id === id && p.activo);
    if (index === -1) return false;

    this.pacientes[index].activo = false;
    return true;
  }

  async findByDocumento(numeroDocumento: string): Promise<Paciente | null> {
    return this.pacientes.find(p => p.numeroDocumento === numeroDocumento && p.activo) || null;
  }
}

const pacienteRepository = new PacienteRepository();

export class PacienteController {

  async getAllPacientes(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;

      let pacientes = await pacienteRepository.findAll();

      // Filtro de búsqueda
      if (search) {
        pacientes = pacientes.filter(p => 
          p.nombre.toLowerCase().includes(search.toLowerCase()) ||
          p.apellido.toLowerCase().includes(search.toLowerCase()) ||
          p.numeroDocumento.includes(search)
        );
      }

      // Paginación
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const paginatedPacientes = pacientes.slice(startIndex, endIndex);

      const response: ApiResponse<PaginatedResponse<Paciente>> = {
        success: true,
        data: {
          data: paginatedPacientes,
          total: pacientes.length,
          page,
          limit,
          totalPages: Math.ceil(pacientes.length / limit)
        }
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Error al obtener pacientes'
      };
      res.status(500).json(response);
    }
  }

  async getPacienteById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const paciente = await pacienteRepository.findById(id);

      if (!paciente) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Paciente no encontrado'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<Paciente> = {
        success: true,
        data: paciente
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Error al obtener paciente'
      };
      res.status(500).json(response);
    }
  }

  async createPaciente(req: Request, res: Response): Promise<void> {
    try {
      const pacienteData: CreatePacienteRequest = req.body;

      // Validaciones básicas
      if (!pacienteData.nombre || !pacienteData.apellido || !pacienteData.numeroDocumento) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Nombre, apellido y número de documento son requeridos'
        };
        res.status(400).json(response);
        return;
      }

      // Verificar si ya existe un paciente con el mismo documento
      const pacienteExistente = await pacienteRepository.findByDocumento(pacienteData.numeroDocumento);
      if (pacienteExistente) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Ya existe un paciente con ese número de documento'
        };
        res.status(409).json(response);
        return;
      }

      const nuevoPaciente = await pacienteRepository.create(pacienteData);

      const response: ApiResponse<Paciente> = {
        success: true,
        data: nuevoPaciente,
        message: 'Paciente creado exitosamente'
      };

      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Error al crear paciente'
      };
      res.status(500).json(response);
    }
  }

  async updatePaciente(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData: Partial<Paciente> = req.body;

      const pacienteActualizado = await pacienteRepository.update(id, updateData);

      if (!pacienteActualizado) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Paciente no encontrado'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<Paciente> = {
        success: true,
        data: pacienteActualizado,
        message: 'Paciente actualizado exitosamente'
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Error al actualizar paciente'
      };
      res.status(500).json(response);
    }
  }

  async deletePaciente(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const eliminado = await pacienteRepository.delete(id);

      if (!eliminado) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Paciente no encontrado'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<null> = {
        success: true,
        message: 'Paciente eliminado exitosamente'
      };

      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Error al eliminar paciente'
      };
      res.status(500).json(response);
    }
  }
}
