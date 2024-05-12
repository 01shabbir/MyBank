#!/usr/bin/env node
import { faker } from "@faker-js/faker";
import chalk from "chalk";
import inquirer from "inquirer";
//customer class
class customer {
    constructor(firstName, lastName, age, gender, mobNumber, accNumber) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
        this.gender = gender;
        this.mobNumber = mobNumber;
        this.accNumber = accNumber;
    }
}
//class bank
class bank {
    constructor() {
        this.customer = [];
        this.account = [];
    }
    addcustomer(obj) {
        this.customer.push(obj);
    }
    addaccount(obj) {
        this.account.push(obj);
    }
    transaction(accobj) {
        let NewAccount = this.account.filter((acc) => acc.accNumber !== accobj.accNumber);
        this.account = [...NewAccount, accobj];
    }
}
let myBank = new bank();
// customer create
for (let i = 1; i <= 3; i++) {
    let fName = faker.person.firstName('male');
    let lName = faker.person.lastName();
    let mobNumber = parseInt(faker.helpers.fromRegExp("3###########"));
    const cus = new customer(fName, lName, 25 * i, "male", mobNumber, 1000 + i);
    myBank.addcustomer(cus);
    myBank.addaccount({ accNumber: cus.accNumber, balance: 100 * i });
}
//bankfanctonality
async function bankservices(bank) {
    do {
        let service = await inquirer.prompt({
            type: "list",
            name: "select",
            message: "select service",
            choices: ["view Balance", "Cash withdraw", " Cash Deposit", "Exit"],
        });
        //view Balance
        if (service.select == "view Balance") {
            let res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: " Plz Enter Your Account Number",
            });
            let account = myBank.account.find((acc) => acc.accNumber == res.num);
            if (!account) {
                console.log(chalk.red.bold("Invalid Account Number"));
            }
            if (account) {
                let name = bank.customer.find((item) => item.accNumber == account?.accNumber);
                console.log(`Dear ${chalk.green.italic(name?.firstName)}
${chalk.green.italic(name?.lastName)} your account  Balance is ${chalk.bold.
                    blueBright(`$${account.balance}`)}`);
            }
        }
        //  Cash withdraw
        if (service.select == "Cash withdraw") {
            let res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: " Plz Enter Your Account Number:",
            });
            let account = myBank.account.find((acc) => acc.accNumber == res.num);
            if (!account) {
                console.log(chalk.red.bold("Invalid Account Number"));
            }
            if (account) {
                let ans = await inquirer.prompt({
                    type: "number",
                    name: "rupee",
                    message: "Plz Enter your  Amount",
                });
                if (ans.rupee > account.balance) {
                    console.log(chalk.red.bold("Insufficient Balance"));
                }
                let newbalance = account.balance - ans.rupee;
                //transaction metod call
                myBank.transaction({ accNumber: account.accNumber, balance: newbalance });
            }
        }
        // Cash Deposit
        if (service.select == " Cash Deposit") {
            let res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: " Plz Enter Your Account Number:",
            });
            let account = myBank.account.find((acc) => acc.accNumber == res.num);
            if (!account) {
                console.log(chalk.red.bold("Invalid Account Number"));
            }
            if (account) {
                let ans = await inquirer.prompt({
                    type: "number",
                    name: "rupee",
                    message: "Plz Enter your  Amount",
                });
                if (ans.rupee > account.balance) {
                    console.log(chalk.red.bold("Insufficient Balance"));
                }
                let newbalance = account.balance + ans.rupee;
                //transaction metod call
                myBank.transaction({ accNumber: account.accNumber, balance: newbalance });
            }
        }
        if (service.select == "Exit") {
            return;
        }
    } while (true);
}
bankservices(myBank);
