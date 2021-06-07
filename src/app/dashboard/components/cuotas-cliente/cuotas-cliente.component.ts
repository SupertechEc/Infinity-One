import { Component, OnInit } from '@angular/core';

const USER_INFO = [
  {"name": "John Smith", "occupation": "Advisor", "dateOfBirth": "1984-05-05", "age": 36},
  {"name": "Muhi Masri", "occupation": "Developer", "dateOfBirth": "1992-02-02", "age": 28},
  {"name": "Peter Adams", "occupation": "HR", "dateOfBirth": "2000-01-01", "age": 20},
  {"name": "Lora Bay", "occupation": "Marketing", "dateOfBirth": "1977-03-03", "age": 43},
];

const USER_SCHEMA = {
  "name": "text",
  "occupation": "text",
  "dateOfBirth": "date",
  "age": "number",
  "edit": "edit"
}

@Component({
  selector: 'app-cuotas-cliente',
  templateUrl: './cuotas-cliente.component.html',
  styleUrls: ['./cuotas-cliente.component.css'],
})
export class CuotasClienteComponent{
  displayedColumns: string[] = ['name', 'occupation', 'dateOfBirth', 'age', 'edit'];
  dataSource = USER_INFO;
  dataSchema = USER_SCHEMA;

}
