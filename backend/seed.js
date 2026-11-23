import bcrypt from "bcrypt";
import { prisma } from "./prisma.js";

async function main() {
  const senhaHash = await bcrypt.hash("Demo@12345", 10);

  await prisma.usuario.upsert({
    where: {
      email: "demo@locadora.com"
    },
    update: {
      nome: "Administrador Demo",
      senha: senhaHash
    },
    create: {
      nome: "Administrador Demo",
      email: "demo@locadora.com",
      senha: senhaHash
    }
  });

  const veiculos = [
    {
      marca: "Toyota",
      modelo: "Corolla",
      placa: "DEM1A23",
      ano: 2022,
      valorDiaria: 180
    },
    {
      marca: "Honda",
      modelo: "Civic",
      placa: "DEM2B34",
      ano: 2023,
      valorDiaria: 200
    },
    {
      marca: "Chevrolet",
      modelo: "Onix",
      placa: "DEM3C45",
      ano: 2024,
      valorDiaria: 120
    },
    {
      marca: "Volkswagen",
      modelo: "T-Cross",
      placa: "DEM4D56",
      ano: 2023,
      valorDiaria: 190
    },
    {
      marca: "Hyundai",
      modelo: "HB20",
      placa: "DEM5E67",
      ano: 2024,
      valorDiaria: 130
    }
  ];

  for (const veiculo of veiculos) {
    await prisma.veiculo.upsert({
      where: {
        placa: veiculo.placa
      },
      update: {
        marca: veiculo.marca,
        modelo: veiculo.modelo,
        ano: veiculo.ano,
        valorDiaria: veiculo.valorDiaria
      },
      create: veiculo
    });
  }

  console.log("Dados de demonstração preparados com sucesso!");
  console.log("Usuário: demo@locadora.com");
  console.log("Senha: Demo@12345");
  console.log("Veículos de demonstração: 5");
}

main()
  .catch((erro) => {
    console.error("Erro ao preparar os dados de demonstração:", erro);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
