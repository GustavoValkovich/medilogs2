const express = require('express');
const cors = require('cors');
const app = express();
const pacientesRoutes = require('./routes/pacientes');
const consultasRoutes = require('./routes/consultas');
const authRoutes = require('./routes/auth');
const charactersRoutes = require('./backend/routers/characters');

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/pacientes', pacientesRoutes);
app.use('/api/consultas', consultasRoutes);
app.use('/api/characters', charactersRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
