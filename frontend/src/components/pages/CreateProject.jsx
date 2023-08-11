import React, { useState } from "react";
import { Alert, Container, Form, Button } from "react-bootstrap";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function CreateProject() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const navigate = useNavigate();
  const location = useLocation();

  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setPending(true);
    const userID = JSON.parse(sessionStorage.userData).id;
    // console.log(userID);
    try {
      await axios.post(
        `http://13.48.5.194:8000/api/v1/projects/${userID}`,
        formData
      );
      console.log("Project created successfully");
      setError("");
      setPending(false);
      setFormData({
        name: "",
        description: "",
      });
      navigate("/", {
        state: {
          prev: location.pathname,
        },
      });
    } catch (err) {
      const error = err.response;
      if (error.status === 404) {
        setError("User does not exist");
      } else {
        setError(error.data?.Error || "An error occurred");
      }
      setPending(false);
    }
  }

  return (
    <Container className="py-5">
      <Form onSubmit={handleSubmit}>
        <h2 className="mb-4">Create Project</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {pending && <Alert variant="info">Creating your project...</Alert>}
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Project Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Project Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Create
        </Button>
      </Form>
    </Container>
  );
}

export default CreateProject;
