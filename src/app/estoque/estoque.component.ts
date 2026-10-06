import { DatePipe } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";

export type TipoMovimentacao = "ENTRADA" | "SAIDA";

export interface Produto {
  codigoProduto: number;
  descricaoProduto: string;
  estoque: number;
}

export interface Movimentacao {
  id: number;
  data: Date;
  codigoProduto: number;
  tipo: TipoMovimentacao;
  quantidade: number;
  descricao: string;
  estoqueFinal: number;
}

@Component({
  selector: "app-estoque",
  standalone: true,
  imports: [FormsModule, DatePipe],
  template: `
    <h2>Movimentação de estoque</h2>

    <form (ngSubmit)="lancar()">
      <label>
        Produto
        <select name="produto" [(ngModel)]="codigoProduto">
          @for (p of produtos; track p.codigoProduto) {
            <option [ngValue]="p.codigoProduto">
              {{ p.codigoProduto }} - {{ p.descricaoProduto }}
            </option>
          }
        </select>
      </label>
      <label>
        Tipo
        <select name="tipo" [(ngModel)]="tipo">
          <option value="ENTRADA">Entrada</option>
          <option value="SAIDA">Saída</option>
        </select>
      </label>
      <label>
        Quantidade
        <input
          name="quantidade"
          type="number"
          min="1"
          step="1"
          [(ngModel)]="quantidade"
        />
      </label>
      <label>
        Descrição da movimentação
        <input name="descricao" type="text" [(ngModel)]="descricao" />
      </label>
      <button type="submit">Lançar</button>
    </form>

    @if (erro) {
      <p class="erro">{{ erro }}</p>
    }
    @if (resultado) {
      <p class="ok">{{ resultado }}</p>
    }

    <h3>Estoque atual</h3>
    <table>
      <thead>
        <tr>
          <th>Código</th>
          <th>Produto</th>
          <th>Quantidade</th>
        </tr>
      </thead>
      <tbody>
        @for (p of produtos; track p.codigoProduto) {
          <tr>
            <td>{{ p.codigoProduto }}</td>
            <td>{{ p.descricaoProduto }}</td>
            <td>{{ p.estoque }}</td>
          </tr>
        }
      </tbody>
    </table>

    <h3>Movimentações</h3>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Data</th>
          <th>Produto</th>
          <th>Tipo</th>
          <th>Qtde</th>
          <th>Descrição</th>
          <th>Estoque final</th>
        </tr>
      </thead>
      <tbody>
        @for (m of movimentacoes; track m.id) {
          <tr>
            <td>{{ m.id }}</td>
            <td>{{ m.data | date: "dd/MM/yyyy HH:mm:ss" }}</td>
            <td>{{ m.codigoProduto }}</td>
            <td>{{ m.tipo === "ENTRADA" ? "Entrada" : "Saída" }}</td>
            <td>{{ m.quantidade }}</td>
            <td>{{ m.descricao }}</td>
            <td>{{ m.estoqueFinal }}</td>
          </tr>
        } @empty {
          <tr>
            <td colspan="7">Nenhuma movimentação lançada.</td>
          </tr>
        }
      </tbody>
    </table>
  `,
})
export class EstoqueComponent {
  produtos: Produto[] = [
    { codigoProduto: 101, descricaoProduto: "Caneta Azul", estoque: 150 },
    {
      codigoProduto: 102,
      descricaoProduto: "Caderno Universitário",
      estoque: 75,
    },
    { codigoProduto: 103, descricaoProduto: "Borracha Branca", estoque: 200 },
    { codigoProduto: 104, descricaoProduto: "Lápis Preto HB", estoque: 320 },
    {
      codigoProduto: 105,
      descricaoProduto: "Marcador de Texto Amarelo",
      estoque: 90,
    },
  ];

  movimentacoes: Movimentacao[] = [];

  codigoProduto = 101;
  tipo: TipoMovimentacao = "ENTRADA";
  quantidade = 1;
  descricao = "";

  erro = "";
  resultado = "";

  private proximoId = 1;

  lancar(): void {
    this.erro = "";
    this.resultado = "";

    const produto = this.produtos.find(
      (p) => p.codigoProduto === this.codigoProduto,
    );
    if (!produto) {
      this.erro = "Produto não encontrado.";
      return;
    }
    if (!Number.isInteger(this.quantidade) || this.quantidade <= 0) {
      this.erro = "Informe uma quantidade inteira maior que zero.";
      return;
    }
    if (!this.descricao.trim()) {
      this.erro = "Informe a descrição da movimentação.";
      return;
    }
    if (this.tipo === "SAIDA" && this.quantidade > produto.estoque) {
      this.erro = `Estoque insuficiente. Disponível: ${produto.estoque}.`;
      return;
    }

    produto.estoque +=
      this.tipo === "ENTRADA" ? this.quantidade : -this.quantidade;

    this.movimentacoes = [
      {
        id: this.proximoId++,
        data: new Date(),
        codigoProduto: produto.codigoProduto,
        tipo: this.tipo,
        quantidade: this.quantidade,
        descricao: this.descricao.trim(),
        estoqueFinal: produto.estoque,
      },
      ...this.movimentacoes,
    ];

    this.resultado = `Movimentação #${this.proximoId - 1} registrada. Estoque final de "${produto.descricaoProduto}": ${produto.estoque}.`;
    this.descricao = "";
  }
}
