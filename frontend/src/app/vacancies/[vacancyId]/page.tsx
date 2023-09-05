'use client';
import api from "@/services/api";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Button, Col, Container, Form, FormControl, Modal, Row, Table } from "react-bootstrap";

type Period = {
  id: number;
  start_date: string;
  end_date: string;
}

type Vacancy = {
  id: number;
  name: string;
  role: string;
  hiring_date: string;
  vacancy_periods: Period[];
};

export default function Vacancies({ params }: { params: { vacancyId: number } }) {
  const [vacancy, setVacancy] = useState<Vacancy>();

  const [showPeriodModal, setShowPeriodModal] = useState(false);

  const [periodStartDate, setPeriodStartDate] = useState('');
  const [periodEndDate, setPeriodEndDate] = useState('');

  const [isPeriodStartDateInvalid, setIsPeriodStartDateInvalid] = useState(false);
  const [isPeriodEndDateInvalid, setIsPeriodEndDateInvalid] = useState(false);

  const [periodStartDateErrorMessage, setPeriodStartDateErrorMessage] = useState('');
  const [periodEndDateErrorMessage, setPeriodEndDateErrorMessage] = useState('');

  useEffect(() => {
    const loadVacancy = async (vacancyId: number) => {
      const response = await api.get<Vacancy>(`/vacancies/${vacancyId}`);

      const allPeriodsDiffs = response.data.vacancy_periods.map(period => dayjs(period.end_date).diff(period.start_date, 'day'));
      const totalPeriods = allPeriodsDiffs.reduce((partialSum, a) => partialSum + a, 0);

      console.log(totalPeriods);

      setVacancy(response.data);
    };

    loadVacancy(params.vacancyId);
  }, [params.vacancyId]);

  const createPeriod = async () => {
    if (!vacancy) {
      return;
    }

    if (!periodStartDate || !Date.parse(periodStartDate)) {
      setIsPeriodStartDateInvalid(true);
      setPeriodStartDateErrorMessage('A data de inicio do período está vazia.');
      return;
    }

    setIsPeriodStartDateInvalid(false);
    setPeriodStartDateErrorMessage('');

    if (!periodEndDate || !Date.parse(periodEndDate)) {
      setIsPeriodEndDateInvalid(true);
      setPeriodEndDateErrorMessage('A data de fim do período está vazia.');
      return;
    }

    setIsPeriodEndDateInvalid(false);
    setPeriodEndDateErrorMessage('');

    const now = dayjs();
    const hiringDate = dayjs(vacancy.hiring_date);
    const minimumPeriodStartDate = hiringDate.add(1, 'year');
    const parsedPeriodStartDate = dayjs(periodStartDate);
    const parsedPeriodEndDate = dayjs(periodEndDate);

    if (parsedPeriodStartDate.isAfter(parsedPeriodEndDate) || parsedPeriodStartDate.isSame(parsedPeriodEndDate, 'day')) {
      setIsPeriodStartDateInvalid(true);
      setPeriodStartDateErrorMessage('A data de inicio não pode ser maior que a data de fim.');
      return;
    }

    if (parsedPeriodStartDate.isBefore(now) || parsedPeriodStartDate.isSame(now, 'day')) {
      setIsPeriodStartDateInvalid(true);
      setPeriodStartDateErrorMessage('A data de inicio não pode ser menor que hoje.');
      return;
    }

    if (parsedPeriodStartDate.isBefore(minimumPeriodStartDate)) {
      setIsPeriodStartDateInvalid(true);
      setPeriodStartDateErrorMessage('Esse colaborador ainda não pode tirar férias, pois ainda não teve 12 meses de trabalho.');
      return;
    }

    if (vacancy.vacancy_periods.length > 0) {
      const endDates = vacancy.vacancy_periods.map(period => new Date(period.end_date).getTime());
      const lastPeriodEnd = new Date(Math.max(...endDates));
      const lastPeriodEndDate = dayjs(lastPeriodEnd);

      console.log(lastPeriodEndDate);

      if (parsedPeriodStartDate.isBefore(lastPeriodEndDate) || parsedPeriodStartDate.isSame(lastPeriodEndDate, 'day')) {
        setIsPeriodStartDateInvalid(true);
        setPeriodStartDateErrorMessage('Esse colaborador ainda não pode ter um novo período, pois ainda não terminou o último período.');
        return;
      }
    }

    setIsPeriodStartDateInvalid(false);
    setPeriodStartDateErrorMessage('');

    const diffPeriod = parsedPeriodEndDate.diff(parsedPeriodStartDate, 'day');

    console.log('diff', diffPeriod);

    if (diffPeriod < 10) {
      setIsPeriodEndDateInvalid(true);
      setPeriodEndDateErrorMessage('O período não pode ser menor que 10 dias.');
      return;
    }

    if (diffPeriod > 30) {
      setIsPeriodEndDateInvalid(true);
      setPeriodEndDateErrorMessage('O período não pode ser maior que 30 dias.');
      return;
    }

    const allPeriodsDiffs = vacancy.vacancy_periods.map(period => dayjs(period.end_date).diff(period.start_date, 'day'));
    const totalPeriods = allPeriodsDiffs.reduce((partialSum, a) => partialSum + a, 0);

    console.log('total', totalPeriods);

    const maxPeriodDays = 30 - totalPeriods;

    console.log('max', maxPeriodDays);

    if (maxPeriodDays <= 0) {
      setIsPeriodEndDateInvalid(true);
      setPeriodEndDateErrorMessage('Você não pode criar novos períodos, pois a soma dos anteriores já resultam em 30 dias.');
      return;
    }

    if (diffPeriod > maxPeriodDays) {
      setIsPeriodEndDateInvalid(true);
      setPeriodEndDateErrorMessage(`Esse período é grande demais, esse período pode ter até ${maxPeriodDays} ${maxPeriodDays > 1 ? 'dias' : 'dia'}.`);
      return;
    }


    if (vacancy.vacancy_periods.length === 0 && diffPeriod > 20 && diffPeriod < 30) {
      setIsPeriodEndDateInvalid(true);
      setPeriodEndDateErrorMessage(`Esse primeiro período possui mais de 20 dias então é obrigatório que ele complete 30 dias corridos.`);
      return;
    }

    if (vacancy.vacancy_periods.length === 1) {

      if (diffPeriod > 10 && diffPeriod < maxPeriodDays) {
        setIsPeriodEndDateInvalid(true);
        setPeriodEndDateErrorMessage(`Esse segundo período possui mais de 10 dias então é obrigatório que ele complete ${maxPeriodDays} ${maxPeriodDays > 1 ? 'dias' : 'dia'} corridos.`);
        return;
      }

      const totalPeriodsAndDiff = totalPeriods + diffPeriod;

      if (totalPeriodsAndDiff !== 30 && 30 - totalPeriodsAndDiff < 10) {
        setIsPeriodEndDateInvalid(true);
        setPeriodEndDateErrorMessage(`Esse período não pode ter essa quantia de dias, pois o próximo terá que ter no mínimo 10 dias, para completar os 30 dias é necessário que esse período possua ${maxPeriodDays} ${maxPeriodDays > 1 ? 'dias' : 'dia'} corridos.`);
        return;
      }
    }

    if (vacancy.vacancy_periods.length === 2 && diffPeriod < 10) {
      setIsPeriodEndDateInvalid(true);
      setPeriodEndDateErrorMessage(`Esse terceiro período não completa 30 dias de férias, para completar é necessário possuir  ${maxPeriodDays} ${maxPeriodDays > 1 ? 'dias' : 'dia'} corridos.`);
      return;
    }

    setIsPeriodEndDateInvalid(false);
    setPeriodEndDateErrorMessage('');

    await api.post('/periods', {
      vacancy_id: vacancy.id,
      start_date: parsedPeriodStartDate.toDate(),
      end_date: parsedPeriodEndDate.toDate(),
    })

    const response = await api.get<Vacancy>(`/vacancies/${vacancy.id}`);

    setVacancy(response.data);

    setPeriodStartDate('');
    setPeriodEndDate('');
    setShowPeriodModal(false);
  };

  return vacancy && (
    <>
      <main>
        <Container className='mt-5'>
          <Row>
            <Col xs={1} />
            <Col xs={10}>
              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Nome</Form.Label>
                <Form.Control type="text" value={vacancy.name} readOnly />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicRole">
                <Form.Label>Cargo</Form.Label>
                <Form.Control type="text" value={vacancy.role} readOnly />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicHiringDate">
                <Form.Label>Data de Contratação (dd/mm/yyyy)</Form.Label>
                <Form.Control type="text" value={dayjs(vacancy.hiring_date).format('DD/MM/YYYY')} readOnly />
              </Form.Group>
              <Form.Group className="mt-3" controlId="formBasicPeriods">
                <Form.Label>Períodos de Férias</Form.Label>
                <Table bordered hover>
                  <thead>
                    <tr>
                      <th>Início (dd/mm/yyyy)</th>
                      <th>Fim (dd/mm/yyyy)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      vacancy.vacancy_periods.map(period => (
                        <tr key={period.id}>
                          <td>{dayjs(period.start_date).format('DD/MM/YYYY')}</td>
                          <td>{dayjs(period.end_date).format('DD/MM/YYYY')}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </Table>
                <Row>
                  <Col xs={4} />
                  <Col xs={4}>
                    <Button href='/' className="me-3">
                      Voltar
                    </Button>
                    {
                      vacancy.vacancy_periods.length < 3
                        ? <Button onClick={() => { setShowPeriodModal(true); }}>
                          Cadastrar Novo Período
                        </Button>
                        : <></>
                    }
                  </Col>
                  <Col xs={4} />
                </Row>
              </Form.Group>
            </Col>
            <Col xs={1} />
          </Row>
        </Container>
      </main>

      <Modal
        show={showPeriodModal}
        onHide={() => setShowPeriodModal(false)}
        centered
        style={{ display: 'block', position: 'fixed', color: '#212529' }}
      >
        <Modal.Header>
          <Modal.Title>Criar um novo período de férias</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Início do período (mm/dd/yyyy)</Form.Label>
            <FormControl
              type="date"
              isInvalid={isPeriodStartDateInvalid}
              value={periodStartDate}
              onChange={(e) => setPeriodStartDate(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              {periodStartDateErrorMessage}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>Fim do período (mm/dd/yyyy)</Form.Label>
            <FormControl
              type="date"
              isInvalid={isPeriodEndDateInvalid}
              value={periodEndDate}
              onChange={(e) => setPeriodEndDate(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              {periodEndDateErrorMessage}
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowPeriodModal(false) }>Fechar</Button>
          <Button variant="danger" onClick={() => { createPeriod() }}>Criar</Button>
        </Modal.Footer>
      </Modal>

    </>
  );
}