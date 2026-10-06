import { CurrencyPipe } from "@angular/common";
import { Component } from "@angular/core";
import { calcularComissoes, VENDAS } from "./comissao";

@Component({
  selector: "app-comissao",
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <h2>Comissão por vendedor</h2>
    <p class="regra">
      Abaixo de R$ 100: sem comissão | abaixo de R$ 500: 1% | a partir de R$
      500: 5%
    </p>
    <table>
      <thead>
        <tr>
          <th>Vendedor</th>
          <th>Total vendido</th>
          <th>Comissão</th>
        </tr>
      </thead>
      <tbody>
        @for (item of comissoes; track item.vendedor) {
          <tr>
            <td>{{ item.vendedor }}</td>
            <td>{{ item.totalVendas | currency: "BRL" }}</td>
            <td>{{ item.comissao | currency: "BRL" }}</td>
          </tr>
        }
      </tbody>
    </table>
  `,
})
export class ComissaoComponent {
  comissoes = calcularComissoes(VENDAS);
}
