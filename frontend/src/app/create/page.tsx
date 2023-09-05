'use client';
import api from "@/services/api";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { FormEventHandler, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";

export default function Create() {
  const { push } = useRouter();

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [hiringDate, setHiringDate] = useState('');

  const [nameIsValid, setNameIsValid] = useState(true);
  const [roleIsValid, setRoleIsValid] = useState(true);
  const [hiringDateIsValid, setHiringDateIsValid] = useState(true);

  const [nameErrorMessage, setNameErrorMessage] = useState('');
  const [roleErrorMessage, setRoleErrorMessage] = useState('');
  const [hiringDateErrorMessage, setHiringDateErrorMessage] = useState('');

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!name) {
      setNameIsValid(false);
      setNameErrorMessage('O nome está vazio.');
      return;
    }

    setNameIsValid(true);
    setNameErrorMessage('');

    if (!role) {
      setRoleIsValid(false);
      setRoleErrorMessage('O cargo está vazio.');
      return;
    }

    setRoleIsValid(true);
    setRoleErrorMessage('');

    if (!hiringDate || !Date.parse(hiringDate)) {
      setHiringDateIsValid(false);
      setHiringDateErrorMessage('A data de contratação está vazia.');
      return;
    }

    setHiringDateIsValid(true);
    setHiringDateErrorMessage('');

    await api.post('/vacancies', {
      name,
      role,
      hiring_date: hiringDate,
    });

    push('/');
  }

  return (
    <main>
      <Container className='mt-5'>
        <Row>
          <Col xs={1} />
          <Col xs={10}>
            <Form noValidate onSubmit={handleSubmit} className="mt-5" method='post'>
              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Nome</Form.Label>
                <Form.Control isInvalid={!nameIsValid} type="text" placeholder="Digite o nome" value={name} onChange={(e) => { setName(e.currentTarget.value) }} />
                <Form.Control.Feedback type="invalid">
                  {nameErrorMessage}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicRole">
                <Form.Label>Cargo</Form.Label>
                <Form.Control isInvalid={!roleIsValid} type="text" placeholder="Digite o cargo" value={role} onChange={(e) => { setRole(e.currentTarget.value) }} />
                <Form.Control.Feedback type="invalid">
                  {roleErrorMessage}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicHiringDate">
                <Form.Label>Data de Contratação (mm/dd/yyyy)</Form.Label>
                <Form.Control isInvalid={!hiringDateIsValid} type="date" value={hiringDate} onChange={(e) => { setHiringDate(e.currentTarget.value) }} />
                <Form.Control.Feedback type="invalid">
                  {hiringDateErrorMessage}
                </Form.Control.Feedback>
              </Form.Group>
              <Button variant="primary" className="me-3" href="/">
                Voltar
              </Button>
              <Button variant="primary" type="submit" id="submit">
                Criar
              </Button>
            </Form>
          </Col>
          <Col xs={1} />
        </Row>
      </Container>
    </main>
  );
}