import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {Chart as ChartJS,CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend,} from 'chart.js';

ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend);

const ObtenerUbicacion = () => {
  const [ubicacion, setUbicacion] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [aqi, setAqi] = useState(null);
  const API_Key = 'b262ba7f9fe7bd8467da504ef2af1d89';

  const getLast12MonthsTimestamps = () => {
    const currentDate = new Date();
    const timestamps = [];

    for (let i = 0; i < 12; i++) {
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1).getTime() / 1000;
      const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 0).getTime() / 1000;
      timestamps.push({ start: firstDayOfMonth, end: lastDayOfMonth });
    }

    return timestamps;
  };

  useEffect(() => {
    if (ubicacion) {
      const fetchHistoricalData = async () => {
        try {
          const timestamps = getLast12MonthsTimestamps();
          const allData = [];

          for (const { start, end } of timestamps) {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution/history?lat=${ubicacion.latitude}&lon=${ubicacion.longitude}&start=${start}&end=${end}&appid=${API_Key}`);

            if (!response.ok) {throw new Error('Error al obtener los datos históricos');}
            const data = await response.json();
            allData.push(data);}

          setHistoricalData(allData);
          const latestAqi = allData[0].list[0].main.aqi;
          setAqi(latestAqi);

          const labels = timestamps.map((timestamp) => {
            const date = new Date(timestamp.start * 1000);
            return date.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
          }).reverse();

          const coData = allData.map((month) => month.list[0]?.components.co || 0).reverse();
          const no2Data = allData.map((month) => month.list[0]?.components.no2 || 0).reverse();
          const pm25Data = allData.map((month) => month.list[0]?.components.pm2_5 || 0).reverse();

          setChartData({
            labels,
            datasets: [
              {
                label: 'CO (μg/m³)',
                data: coData,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
              },
              {
                label: 'NO2 (μg/m³)',
                data: no2Data,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
              },
              {
                label: 'PM2.5 (μg/m³)',
                data: pm25Data,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
              },
            ],
          });
        }

        catch (error) {
          console.error('Error:', error);
        }
      };

      fetchHistoricalData();
    }
  }, [ubicacion]);

  const handleGetLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUbicacion({ latitude, longitude });
        },
        (error) => {
          console.error('Error al obtener la ubicación:', error);
        }
      );
    } else {
      console.log('Geolocalización no está disponible en este navegador.');
    }
  };

  const getAqiClass = (aqi) => {
    if (aqi === 1) return 'aqi-good';
    if (aqi === 2) return 'aqi-moderate';
    if (aqi === 3) return 'aqi-unhealthy';
    if (aqi === 4) return 'aqi-very-unhealthy';
    if (aqi === 5) return 'aqi-hazardous';
    return '';
  };

  return (
    <div className="container">
      <h1>Obtener Ubicación del Usuario</h1>
      <button onClick={handleGetLocation}>Obtener Ubicación</button>
      {ubicacion && (
        <div>
          <h2>Tu Ubicación:</h2>
          <p>Latitud: {ubicacion.latitude}</p>
          <p>Longitud: {ubicacion.longitude}</p>
        </div>
      )}
      {aqi && (
        <div className={`aqi-result ${getAqiClass(aqi)}`}>
          <h3>Índice de Calidad del Aire (AQI): {aqi}</h3>
        </div>
      )}
      {chartData ? (
        <div className="chart-container">
          <Line data={chartData} />
        </div>
      ) : (
        <p>Cargando datos históricos...</p>
      )}

      {/* Leyenda para interpretar los datos */}
      <div>
        <h3>Interpretación de la Calidad del Aire (AQI)</h3>
        <p><strong>1:</strong> Buena (Sin riesgo)</p>
        <p><strong>2:</strong> Moderada (Aceptable, pero algunos sensibles pueden tener efectos menores)</p>
        <p><strong>3:</strong> Dañina para grupos sensibles (Efectos para personas con condiciones preexistentes)</p>
        <p><strong>4:</strong> Dañina (Efectos de salud para todos)</p>
        <p><strong>5:</strong> Muy dañina (Alerta de salud)</p>
      </div>
    </div>
  );
};

export default ObtenerUbicacion;
