import React from 'react';
import { DataGrid, GridColumn, Form, Dialog, TextBox, Label, LinkButton, ButtonGroup, ComboBox } from 'rc-easyui';

// import logo from './logo.svg';
import './App.css';

const situations = [
  { value: 1, text: 'Livre' }, 
  { value: 2, text: 'Em Curso' }, 
  { value: 3, text: 'Retomando' }
];

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      pageSize: 10,
      pageNumber: 1,
      editingRow: null,
      model: {}, 
      rules: {
        'name': 'required',
        'cpf': 'required',
      },
      closed: true,
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    let data = [];
    for (let i = 1; i <= 100; i++) {
      let situation = situations[Math.floor(Math.random() * (3 - 0) + 0)].value;
      let status = Math.floor(Math.random() * (2 - 0) + 0);
      data.push({ id: i, name: `Motorista ${i}`, cpf: Math.random(), email: `motorista${i}@email.com`, situation, status });
    }
    this.setState({ data });
  }

  getError(name) {
    const { errors } = this.state;
    if (!errors) {
      return null;
    }
    return errors[name] && errors[name].length ? errors[name][0] : null;
  }

  handleChangePage(event) {
    this.setState({ ...event });
  }

  handleEditRow(row) {
    this.setState({ editingRow: row, model: Object.assign({}, row), title: 'Edit', closed: false });
  }

  handleCreateRow(row) {
    this.setState({ editingRow: null, model: {}, title: 'Create', closed: false });
  }

  handleSaveRow() {
    this.form.validate(() => {
      if (this.form.valid()) {
        let data = this.state.data.slice();
        let row = Object.assign({}, this.state.editingRow, this.state.model);
        row.id = data.length + 1;
        if (this.state.editingRow) {
          let index = data.indexOf(this.state.editingRow);
          data.splice(index, 1, row);
          
        }
        else {
          data.push(row);
        }
        this.setState({ data, closed: true });
      }
    })
  }

  handleDeleteRow(row) {
    const { data } = this.state;
    this.setState({ data: data.filter(r => r !== row) });
  }

  handleCloseForm(event) {
    this.setState({ closed: true });
  }

  renderDialog() {
    const row = this.state.model;
    const { title, closed, rules } = this.state;
    return (
      <Dialog modal title={title} className="dialogForm" closed={closed} onClose={(event) => this.handleCloseForm() }>
        <div className="f-full">
          <Form className="f-full" ref={ref => this.form = ref} model={row} rules={rules} onValidate={(errors) => this.setState({ errors: errors })}>
            <div>
              <Label htmlFor="name">Name:</Label>
              <TextBox inputId="name" name="name" value={row.name}></TextBox>
              <div className="error">{this.getError('name')}</div>
            </div>
            <div>
              <Label htmlFor="cpf">CPF:</Label>
              <TextBox inputId="cpf" name="cpf" value={row.cpf}></TextBox>
              <div className="error">{this.getError('cpf')}</div>
            </div>
            <div>
              <Label htmlFor="email">Email:</Label>
              <TextBox inputId="email" name="email" value={row.email}></TextBox>
              <div className="error">{this.getError('email')}</div>
            </div>
            <div>
              <Label htmlFor="situation">Situação:</Label>
              <ComboBox inputId="situation" name="situation" value={row.situation} data={situations} />
              <div className="error">{this.getError('situation')}</div>
            </div>
            <div>
              <Label htmlFor="status">Status:</Label>
              <ComboBox inputId="status" name="status" value={row.status} data={[{ value: 0, text: 'Inativo' }, { value: 1, text: 'Ativo' }]} />
              <div className="error">{this.getError('status')}</div>
            </div>
          </Form>
        </div>
        <div className="dialog-button">
          <LinkButton onClick={() => this.handleSaveRow()}>Save</LinkButton>
          <LinkButton onClick={() => this.handleCloseForm()}>Close</LinkButton>
        </div>
      </Dialog>
    )
  }

  render() {
    const { data, pageNumber, pageSize } = this.state;
    return (
      <>
        <div className="container">
          <h1>Fusion - Motoristas</h1>
          <div>
            <LinkButton onClick={() => this.handleCreateRow()} className="btnCreate">Cadastrar Motorista</LinkButton>
          </div>
          <DataGrid data={data} pagination clickToEdit selectionMode="cell" editMode="cell" total={data.length} pageSize={pageSize} pageNumber={pageNumber} onPageChange={event => this.handleChangePage(event)} className="dataGrid">
            <GridColumn field="name" title="Nome"></GridColumn>
            <GridColumn field="cpf" title="CPF"></GridColumn>
            <GridColumn field="email" title="Email"></GridColumn>
            <GridColumn field="situation" title="Situação" render={({ row }) => situations[row.situation-1].text }></GridColumn>
            <GridColumn field="status" title="Status" render={({ row }) => ['Inativo', 'Ativo'][row.status]}></GridColumn>
            <GridColumn field="act" title="Actions" align="center" width={110}
              render={({ row }) => (
                <>
                  <ButtonGroup style={{ padding: 5 }}>
                    <LinkButton onClick={() => this.handleEditRow(row)}>Edit</LinkButton>
                    <LinkButton onClick={() => this.handleDeleteRow(row)}>Delete</LinkButton>
                  </ButtonGroup>
                </>
              )}
            />
          </DataGrid>
          <p>Total: {data.length} / Por Página: {pageSize} / Página Atual: {pageNumber}</p>
        </div>
        {this.renderDialog()}
      </>
    );
  }
}

export default App;
