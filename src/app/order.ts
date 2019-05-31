export class Order {
  personsName: string;
  centreEmailAddress: string;
  centreTelephoneNumber: number;
  centreNumber: string;
  centreName: string;
  invoices: [{
    invoice: string;
    invoice2: string;
  }];
  amount: string;
  currency: string;
  comments: [string];
  cardtype: string;
  declaration: boolean;
}
