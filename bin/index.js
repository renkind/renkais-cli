#! /usr/bin/env node

import chalk from "chalk"; // 命令行美化工具
import ora from "ora"; // 命令行 loading 效果
import inquirer from "inquirer"; // 命令行交互工具
import fs from "fs-extra"; // 传统fs复制文件目录需要加很多判断比较麻烦,fs-extra解决了这个问题
import path from "path"; // 命令行交互工具
import { program } from "commander"; // 引入commander
import download from "download-git-repo";

// 定义 create 命令
program
  .command("create") // 配置命令的名字
  .alias("init") // 命令的别名
  .description("创建一个项目") // 命令对应的描述
  .option("-f, --force", "如果文件存在就强行覆盖")
  .action(async (option1, option2) => {
    /**
     * 这里 action 参数的数量需要和我们定义的option数量一致
     * 比如我们现在定义了 -f 和 -l 两个 option，那我们就需要填写 option1 和 option2 两个参数
     * 假如只填写一个参数的话，执行my-cli create my-project -l 时，就会报错error: unknown option '-l'
     */
    // 取 process.argv[3] 为项目文件夹名称
    const projectName = process.argv[3];
    console.log(`以【${projectName}】为项目名进行初始化...`);
    try {
      // 利用inquirer与用户进行交互
      let { choose } = await inquirer.prompt([
        {
          name: "choose", // 获取选择后的结果
          type: "list",
          message: "请选择一个模板创建项目",
          choices: [
            "vue2-admin",
            "vue3-admin",
            "react-admin",
            "uniapp-template",
          ], // 模板选项列表
        },
      ]);
      const syncTemplate = ora(`【${choose}】正在加载项目模板....`);
      syncTemplate.start();
      // 复制模板到目标目录
      /**
       * https://github.com + : + projectname + # + 分支名称
       */

      download(
        `https://github.com:renkind/${choose}`,
        `./${projectName}`,
        {}, // option配置项
        function (err) {
          if (err) {
            syncTemplate.warn("项目创建失败，错误信息如下:");
            chalk.blue.underline.bold(projectName) +
              " 项目创建失败，错误信息如下:";
            console.error(err);
            return;
          }
          syncTemplate.succeed();
          console.log(
            chalk.green(
              chalk.blue.underline.bold(projectName) + " 项目创建成功!"
            )
          );
          console.log(`
              __      __   __     __            __      _
             /  |    /  |  | |   / /      ___   | |    |_|
            / /| |  / /| |  |_| /_/      / __|  | |    | |
           / /  | |/ /  | |   | |       | (__   | |__  | |
          /_/    |__/    |_|  |_|        |___|  |_|__| |_|
        
          `);
        }
      );
    } catch (err) {
      console.error(err);
    }
  });

/**
 * 处理用户执行时输入的参数,默认值是process.argv
 * process.argv 是 nodejs 提供的属性
 * 比如我们执行 my-cli create my-project 命令时，process.argv 的值是下面这样一个数组:
 * ['D:\\nvm-noinstall\\v16.17.0\\node.exe', 'D:\\nvm-noinstall\\v16.17.0\\node_modules\\my-cli\\bin\\index.js', 'create',  'test']
 * 以下这行代码也可以写为 program.parse(process.argv);
 */
program.parse();
