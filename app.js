const express = require('express');
const cors = require('cors');
const app = express();
const pacientesRoutes = require('./routes/pacientes');
const consultasRoutes = require('./routes/consultas');
const authRoutes = require('./routes/auth');

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/pacientes', pacientesRoutes);
app.use('/api/consultas', consultasRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
