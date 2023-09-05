'use client';
import api from '@/services/api';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Button, Col, Container, Row, Table } from 'react-bootstrap'

type Vacancy = {
  id: number;
  name: string;
  role: string;
  hiring_date: Date;
};

export default function Home() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);

  useEffect(() => {
    const loadVacancies = async () => {
      const response = await api.get<Vacancy[]>('/vacancies');

      setVacancies(response.data);
    };

    loadVacancies();
  }, []);

  return (
    <main>
      <Container className='mt-5'>
        <Row>
          <Col xs={1} />
          <Col xs={10}>
            <Table bordered hover>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Cargo</th>
                  <th>Data de Contratação</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {
                  vacancies.map(vacancy => (
                    <tr key={vacancy.id}>
                      <td>{vacancy.name}</td>
                      <td>{vacancy.role}</td>
                      <td>{dayjs(vacancy.hiring_date).format('DD/MM/YYYY')}</td>
                      <td className='d-flex' style={{ justifyContent: 'center' }}>
                        <Button href={`/vacancies/${vacancy.id}`}>Ver</Button>
                      </td>
                    </tr>))
                }
              </tbody>
            </Table>
          </Col>
          <Col xs={1} />
        </Row>
        <Row>
          <Col xs={4} />
          <Col xs={4}>
            <Button href='/create'>
              Cadastrar Colaborador
            </Button>
          </Col>
          <Col xs={4} />
        </Row>
      </Container>
    </main>
  )
}
