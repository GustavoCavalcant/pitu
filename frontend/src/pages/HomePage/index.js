import React from 'react';
import Header from '../../components/Header';
import { Container, InputGroup, FormControl, Button, Alert, Spinner } from 'react-bootstrap';
import { ContentContainer, Form, AdsBlock } from './styles';
import ShortenerService from '../../services/shortenerService';
import vars from '../../configs/vars'

class HomePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            url: '',
            code: '',
            errorMessage: '',
        }
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        const { url } = this.state;

        // Se estiver carregando, não aparecee mensagem de erro
        this.setState({ isLoading: true, errorMessage: '' });

        // se url estiver vazia, passa falso para carregamento e traz mensagem de erro
        if (!url) {
            this.setState({ isLoading: false, errorMessage: 'Informe uma url para encurtar.' });

            // se url tiver um valor ele aciona o serviço e gera uma url
        } else {
            try {
                const service = new ShortenerService();
                const result = await service.generate({ url });

                this.setState({ isLoading: false, code: result.code })
            } catch (error) {
                this.setState({ isLoading: false, errorMessage: 'Ops, ocorreu um erro ao tentar encurtar a url.' })

            }
        }
    }

    copyToClipboard = () => {
        const element = this.inputURL;
        element.select();
        document.execCommand('copy');
    }

    render() {
        const { isLoading, errorMessage, code } = this.state;

        return (
            <Container>
                <Header>Seu novo encurtador de URL.</Header>
                <ContentContainer>
                    <Form onSubmit={this.handleSubmit}>
                        <InputGroup className="mb-3">
                            <FormControl
                                placeholder="Digite a url para encurtar"
                                defaultValue=""
                                onChange={e => this.setState({ url: e.target.value })}
                            />
                            <InputGroup.Append>
                                <Button variant="primary" type="submit">Encurtar</Button>
                            </InputGroup.Append>
                        </InputGroup>

                        {isLoading ? (
                            <Spinner animation="border" />
                        ) : (
                                code && (
                                    <>
                                        <InputGroup className="mb-3">
                                            <FormControl
                                                autoFocus={true}
                                                defaultValue={vars.HOST_APP + code}
                                                ref={(input) => this.inputURL = input}
                                            />
                                            <InputGroup.Append>
                                                <Button variant="outline-secondary" onClick={() => this.copyToClipboard()}>Copiar</Button>
                                            </InputGroup.Append>
                                        </InputGroup>
                                            <p>Para acompanhar as estatísticas, acesse: {vars.HOST_APP + code}/stats</p>
                                    </>
                                )
                            )}
                            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                    </Form>
                </ContentContainer>
                <ContentContainer>
                    <AdsBlock>AdSense</AdsBlock>
                </ContentContainer>
            </Container>
        )
    }
}

export default HomePage;