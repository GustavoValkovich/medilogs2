import { Request, Response } from 'express';
import { PacienteRepository } from '../repositories/paciente-db.repository';
import { 
  CreatePacienteRequest, 
  UpdatePacienteRequest,
  ApiResponse, 
  PaginatedResponse,
  PacienteCompleto 
} from '../types/database';

const pacienteRepository = new PacienteRepository();

export class PacienteController {

  async getAllPacientes(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;

      const { pacientes, total } = await pacienteRepository.findAll(page, limit, search);

      const response: ApiResponse<PaginatedResponse<PacienteCompleto>> = {
        success: true,
        data: {
          data: pacientes,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };

      res.json(response);
    } catch (error) {
      console.error('Error en getAllPacientes:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Error al obtener pacientes'
      };
      res.status(500).json(response);
    }
  }

  async getPacienteById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'ID de paciente inválido'
        };
        res.status(400).json(response);
        return;
      }

      const paciente = await pacienteRepository.findById(id);

      if (!paciente) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Paciente no encontrado'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<PacienteCompleto> = {
        success: true,
        data: paciente
      };

      res.json(response);
    } catch (error) {
      console.error('Error en getPacienteById:', error);
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
      if (!pacienteData.nombre || !pacienteData.documento || !pacienteData.nacimiento) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Nombre, documento y fecha de nacimiento son requeridos'
        };
        res.status(400).json(response);
        return;
      }

      // Verificar si ya existe un paciente con el mismo documento
      const pacienteExistente = await pacienteRepository.findByDocumento(pacienteData.documento);
      if (pacienteExistente) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Ya existe un paciente con ese número de documento'
        };
        res.status(409).json(response);
        return;
      }

      const nuevoPaciente = await pacienteRepository.create(pacienteData);

      const response: ApiResponse<typeof nuevoPaciente> = {
        success: true,
        data: nuevoPaciente,
        message: 'Paciente creado exitosamente'
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Error en createPaciente:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Error al crear paciente'
      };
      res.status(500).json(response);
    }
  }

  async updatePaciente(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const updateData: UpdatePacienteRequest = req.body;

      if (isNaN(id)) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'ID de paciente inválido'
        };
        res.status(400).json(response);
        return;
      }

      const pacienteActualizado = await pacienteRepository.update(id, updateData);

      if (!pacienteActualizado) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Paciente no encontrado'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<typeof pacienteActualizado> = {
        success: true,
        data: pacienteActualizado,
        message: 'Paciente actualizado exitosamente'
      };

      res.json(response);
    } catch (error) {
      console.error('Error en updatePaciente:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Error al actualizar paciente'
      };
      res.status(500).json(response);
    }
  }

  async deletePaciente(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'ID de paciente inválido'
        };
        res.status(400).json(response);
        return;
      }

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
      console.error('Error en deletePaciente:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Error al eliminar paciente'
      };
      res.status(500).json(response);
    }
  }

  async getPacientesImportantes(req: Request, res: Response): Promise<void> {
    try {
      const pacientes = await pacienteRepository.getPacientesImportantes();

      const response: ApiResponse<typeof pacientes> = {
        success: true,
        data: pacientes
      };

      res.json(response);
    } catch (error) {
      console.error('Error en getPacientesImportantes:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Error al obtener pacientes importantes'
      };
      res.status(500).json(response);
    }
  }

  async getPacientesByMedico(req: Request, res: Response): Promise<void> {
    try {
      const medicoId = parseInt(req.params.medicoId);

      if (isNaN(medicoId)) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'ID de médico inválido'
        };
        res.status(400).json(response);
        return;
      }

      const pacientes = await pacienteRepository.getPacientesByMedico(medicoId);

      const response: ApiResponse<typeof pacientes> = {
        success: true,
        data: pacientes
      };

      res.json(response);
    } catch (error) {
      console.error('Error en getPacientesByMedico:', error);
      const response: ApiResponse<null> = {
        success: false,
        error: 'Error al obtener pacientes del médico'
      };
      res.status(500).json(response);
    }
  }
}
