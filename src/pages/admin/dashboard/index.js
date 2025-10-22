import React from 'react';
import styled from 'styled-components';
import { FiCalendar, FiMapPin, FiTrendingUp, FiUsers } from 'react-icons/fi';
import SidebarAdmin from '../../../components/SidebarAdmin';
import { eventoService } from '../../../services/eventService';
import { lugarService } from '../../../services/lugarService';
import { usuarioService } from '../../../services/usuarioService';


const AdminContainer = styled.div`
  background: 
    radial-gradient(circle at 20% 80%, #d0e6ffff 0%, transparent 25%),
    radial-gradient(circle at 80% 20%, #c4e0ffff 0%, transparent 25%),
    radial-gradient(circle at 40% 40%, #ffffff 0%, transparent 25%),
    #f8fafc;
  min-height: 100vh;
`;

const ContentContainer = styled.div`
  margin-left: 250px;
  padding: 40px;
`;

const Header = styled.div`
  margin-bottom: 40px;
`;

const Title = styled.h1`
  color: #1a237e;
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 18px;
  margin: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.color || 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'};
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => props.bgColor || 'rgba(102, 126, 234, 0.1)'};
  color: ${props => props.color || '#667eea'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #1a237e;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
`;

const ChartCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  grid-column: 1 / -1;
  margin-bottom: 40px;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const ChartTitle = styled.h3`
  color: #1a237e;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ChartIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;

const ViewToggle = styled.div`
  display: flex;
  background: #f1f5f9;
  border-radius: 8px;
  padding: 4px;
`;

const ToggleButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.active ? '#1a237e' : 'transparent'};
  color: ${props => props.active ? 'white' : '#64748b'};

  &:hover {
    background: ${props => props.active ? '#1a237e' : '#e2e8f0'};
  }
`;

const ChartContainer = styled.div`
  height: 300px;
  position: relative;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  gap: 16px;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: #64748b;
  font-size: 14px;
  margin: 0;
`;

const Chart = styled.svg`
  width: 100%;
  height: 100%;
`;

const ChartGrid = styled.g`
  stroke: #e2e8f0;
  stroke-width: 1;
`;

const ChartLine = styled.path`
  fill: none;
  stroke: #94a3b8;
  stroke-width: 2;
`;



const ChartLabel = styled.text`
  fill: ${props => props.isToday ? '#1a237e' : '#64748b'};
  font-size: 12px;
  font-weight: ${props => props.isToday ? '600' : '400'};
  text-anchor: middle;
`;

const ChartValue = styled.text`
  fill: #1a237e;
  font-size: 12px;
  font-weight: 600;
  text-anchor: middle;
`;

const WelcomeSection = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  }
`;

const WelcomeTitle = styled.h2`
  color: #1a237e;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const WelcomeText = styled.p`
  color: #64748b;
  font-size: 16px;
  line-height: 1.6;
  margin: 0;
  max-width: 600px;
  margin: 0 auto;
`;

const Dashboard = () => {
  const [stats, setStats] = React.useState({
    eventosAtivos: 0,
    pistasAtivas: 0,
    usuariosAtivos: 0
  });
  const [loading, setLoading] = React.useState(true);
  const [chartView, setChartView] = React.useState('week');
  const [chartData, setChartData] = React.useState([]);

  React.useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      const [eventos, lugares, usuarios] = await Promise.all([
        eventoService.listar(),
        lugarService.listar(),
        usuarioService.listar()
      ]);
      
      console.log('Eventos carregados:', eventos);
      const eventosAtivos = eventos.filter(evento => {
        console.log('Evento:', evento.nome, 'Status:', evento.statusEvento);
        return evento.statusEvento === 'ativado' || evento.statusEvento === 'ATIVO' || evento.statusEvento === 'ativo';
      }).length;
      console.log('Eventos ativos encontrados:', eventosAtivos);
      const pistasAtivas = lugares.filter(lugar => 
        lugar.statusPista === 'ativada' || lugar.statusPista === 'ATIVA'
      ).length;
      const usuariosAtivos = usuarios.filter(usuario => 
        usuario.statusUsuario === 'ATIVO' || usuario.statusUsuario === 'ativo'
      ).length;
      
      setStats({
        eventosAtivos,
        pistasAtivas,
        usuariosAtivos
      });
      
      processChartData(usuarios);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      setStats({ eventosAtivos: 0, pistasAtivas: 0, usuariosAtivos: 0 });
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (usuarios) => {
    const now = new Date();
    const data = [];
    
    if (chartView === 'week') {
      const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      const currentDay = now.getDay();
      
      // Criar array com 7 dias centrado no dia atual
      const orderedDays = [];
      const orderedCounts = [];
      
      for (let i = -3; i <= 3; i++) {
        const dayIndex = (currentDay + i + 7) % 7;
        const targetDate = new Date(now);
        targetDate.setDate(now.getDate() + i);
        
        // Contar cadastros para este dia específico
        let count = 0;
        usuarios.forEach(usuario => {
          const userDate = new Date(usuario.dataCadastro);
          if (userDate.toDateString() === targetDate.toDateString()) {
            count++;
          }
        });
        
        orderedDays.push(weekDays[dayIndex]);
        orderedCounts.push(count);
      }
      
      orderedDays.forEach((day, index) => {
        data.push({ 
          label: day, 
          value: orderedCounts[index],
          isToday: index === 3
        });
      });
    } else {
      // Mostrar dias do mês atual
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      const counts = new Array(daysInMonth).fill(0);
      
      usuarios.forEach(usuario => {
        const date = new Date(usuario.dataCadastro);
        if (date.getFullYear() === currentYear && date.getMonth() === currentMonth) {
          const day = date.getDate();
          counts[day - 1]++; // -1 porque array começa em 0
        }
      });
      
      for (let day = 1; day <= daysInMonth; day++) {
        data.push({ 
          label: day.toString(), 
          value: counts[day - 1],
          isToday: day === now.getDate()
        });
      }
    }
    
    setChartData(data);
  };

  React.useEffect(() => {
    if (stats.totalUsuarios > 0) {
      usuarioService.listar().then(processChartData);
    }
  }, [chartView]);

  const renderChart = () => {
    if (!chartData.length) return null;
    
    const maxValue = Math.max(...chartData.map(d => d.value), 1);
    const width = 800;
    const height = 250;
    const padding = 60;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    const points = chartData.map((d, i) => {
      const x = padding + (i * chartWidth) / (chartData.length - 1);
      const y = padding + chartHeight - (d.value / maxValue) * chartHeight;
      return { x, y, value: d.value, label: d.label };
    });
    
    const pathData = points.reduce((path, point, i) => {
      if (i === 0) {
        return `M ${point.x} ${point.y}`;
      }
      
      const prevPoint = points[i - 1];
      const controlX1 = prevPoint.x + (point.x - prevPoint.x) * 0.4;
      const controlY1 = prevPoint.y;
      const controlX2 = point.x - (point.x - prevPoint.x) * 0.4;
      const controlY2 = point.y;
      
      return `${path} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${point.x} ${point.y}`;
    }, '');
    
    return (
      <Chart viewBox={`0 0 ${width} ${height}`}>
        <ChartGrid>
          {[0, 1, 2, 3, 4].map(i => {
            const y = padding + (i * chartHeight) / 4;
            return <line key={i} x1={padding} y1={y} x2={width - padding} y2={y} />;
          })}
        </ChartGrid>
        
        <ChartLine d={pathData} />
        
        {points.map((point, i) => (
          <g key={i}>
            <ChartLabel x={point.x} y={height - 20} isToday={chartData[i]?.isToday}>{point.label}</ChartLabel>
            {point.value > 0 && <ChartValue x={point.x} y={point.y - 15}>{point.value}</ChartValue>}
          </g>
        ))}
      </Chart>
    );
  };

  return (
    <AdminContainer>
      <SidebarAdmin />
      <ContentContainer>
        <Header>
          <Title>Dashboard</Title>
          <Subtitle>Visão geral da plataforma SkateFlow</Subtitle>
        </Header>

        <StatsGrid>
          <StatCard color="linear-gradient(90deg, #667eea 0%, #764ba2 100%)">
            <StatHeader>
              <div>
                <StatValue>{loading ? '...' : stats.eventosAtivos}</StatValue>
                <StatLabel>Eventos Ativos</StatLabel>
              </div>
              <StatIcon bgColor="rgba(102, 126, 234, 0.1)" color="#667eea">
                <FiCalendar />
              </StatIcon>
            </StatHeader>
          </StatCard>

          <StatCard color="linear-gradient(90deg, #f59e0b 0%, #d97706 100%)">
            <StatHeader>
              <div>
                <StatValue>{loading ? '...' : stats.pistasAtivas}</StatValue>
                <StatLabel>Pistas Ativas</StatLabel>
              </div>
              <StatIcon bgColor="rgba(245, 158, 11, 0.1)" color="#f59e0b">
                <FiMapPin />
              </StatIcon>
            </StatHeader>
          </StatCard>

          <StatCard color="linear-gradient(90deg, #10b981 0%, #059669 100%)">
            <StatHeader>
              <div>
                <StatValue>{loading ? '...' : stats.usuariosAtivos}</StatValue>
                <StatLabel>Usuários Ativos</StatLabel>
              </div>
              <StatIcon bgColor="rgba(16, 185, 129, 0.1)" color="#10b981">
                <FiUsers />
              </StatIcon>
            </StatHeader>
          </StatCard>



          <StatCard color="linear-gradient(90deg, #8b5cf6 0%, #7c3aed 100%)">
            <StatHeader>
              <div>
                <StatValue>100%</StatValue>
                <StatLabel>Sistema Online</StatLabel>
              </div>
              <StatIcon bgColor="rgba(139, 92, 246, 0.1)" color="#8b5cf6">
                <FiTrendingUp />
              </StatIcon>
            </StatHeader>
          </StatCard>
        </StatsGrid>

        <ChartCard>
          <ChartHeader>
            <ChartTitle>
              <ChartIcon>
                <FiUsers />
              </ChartIcon>
              Cadastros de Usuários
            </ChartTitle>
            <ViewToggle>
              <ToggleButton 
                active={chartView === 'week'} 
                onClick={() => setChartView('week')}
              >
                Semana
              </ToggleButton>
              <ToggleButton 
                active={chartView === 'month'} 
                onClick={() => setChartView('month')}
              >
                Mês
              </ToggleButton>
            </ViewToggle>
          </ChartHeader>
          <ChartContainer>
            {loading ? (
              <LoadingContainer>
                <LoadingSpinner />
                <LoadingText>Carregando dados do gráfico...</LoadingText>
              </LoadingContainer>
            ) : (
              renderChart()
            )}
          </ChartContainer>
        </ChartCard>

        <WelcomeSection>
          <WelcomeTitle>Bem-vindo ao Painel Administrativo</WelcomeTitle>
          <WelcomeText>
            Aqui você pode gerenciar todos os aspectos da plataforma SkateFlow. 
            Use o menu lateral para navegar entre as diferentes seções: eventos, pistas, usuários e muito mais. 
            Mantenha a comunidade de skate sempre atualizada com conteúdo relevante e de qualidade.
          </WelcomeText>
        </WelcomeSection>
      </ContentContainer>
    </AdminContainer>
  );
};

export default Dashboard;