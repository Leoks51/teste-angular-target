import { CurrencyPipe } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";

const TAXA_DIARIA = 0.025;
const MS_POR_DIA = 24 * 60 * 60 * 1000;

// Aceita "yyyy-MM-dd" (input date) e usa meia-noite local para evitar erro de fuso.
function diasDeAtraso(vencimento: string, hoje = new Date()): number {
  const [ano, mes, dia] = vencimento.split("-").map(Number);
  const dataVencimento = Date.UTC(ano, mes - 1, dia);
  const dataHoje = Date.UTC(
    hoje.getFullYear(),
    hoje.getMonth(),
    hoje.getDate(),
  );
  return Math.max(0, Math.round((dataHoje - dataVencimento) / MS_POR_DIA));
}

@Component({
  selector: "app-juros",
  standalone: true,
  imports: [FormsModule, CurrencyPipe],
  template: `
    <h2>Cálculo de juros por atraso</h2>
    <p class="regra">
      Juros simples de 2,5% ao dia sobre o valor, contados a partir do
      vencimento até hoje.
    </p>

    <form (ngSubmit)="calcular()">
      <label>
        Valor (R$)
        <input
          name="valor"
          type="number"
          min="0.01"
          step="0.01"
          [(ngModel)]="valor"
        />
      </label>
      <label>
        Data de vencimento
        <input name="vencimento" type="date" [(ngModel)]="vencimento" />
      </label>
      <button type="submit">Calcular</button>
    </form>

    @if (erro) {
      <p class="erro">{{ erro }}</p>
    }
    @if (calculado) {
      <table>
        <tbody>
          <tr>
            <th>Dias em atraso</th>
            <td>{{ dias }}</td>
          </tr>
          <tr>
            <th>Juros</th>
            <td>{{ juros | currency: "BRL" }}</td>
          </tr>
          <tr>
            <th>Total a pagar</th>
            <td>{{ valor! + juros | currency: "BRL" }}</td>
          </tr>
        </tbody>
      </table>
    }
  `,
})
export class JurosComponent {
  valor: number | null = null;
  vencimento = "";

  dias = 0;
  juros = 0;
  calculado = false;
  erro = "";

  calcular(): void {
    this.calculado = false;
    this.erro = "";

    if (this.valor === null || this.valor <= 0 || !this.vencimento) {
      this.erro = "Informe um valor maior que zero e a data de vencimento.";
      return;
    }

    this.dias = diasDeAtraso(this.vencimento);
    this.juros = Math.round(this.valor * TAXA_DIARIA * this.dias * 100) / 100;
    this.calculado = true;
  }
}
