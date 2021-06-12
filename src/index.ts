const screenshot = require("screenshot-desktop");
const fs = require("fs");

import {
  QKeySequence,
  QApplication,
  QMainWindow,
  QMenu,
  QIcon,
  QSystemTrayIcon,
  QAction,
  QPixmap,
  QLabel,
  QWidget,
  QBoxLayout,
  AspectRatioMode,
  Direction,
} from "@nodegui/nodegui";
import path from "path";
const icon = require("../assets/nodegui_white.png");

const win = new QMainWindow();
const trayIcon = new QIcon(path.resolve(__dirname, icon));
const tray = new QSystemTrayIcon();
const lay = new QBoxLayout(Direction.TopToBottom);
const label = new QLabel(win);
let pixmap = new QPixmap();

tray.setIcon(trayIcon);
tray.show();
tray.setToolTip("NCapturer");

// tray icon
const menu = new QMenu();
tray.setContextMenu(menu);

const quitAction = new QAction();
quitAction.setText("Quit");
quitAction.setIcon(trayIcon);
quitAction.addEventListener("triggered", () => {
  const app = QApplication.instance();
  app.exit(0);
});

const captureAction = new QAction();
captureAction.setText("Capture screen");
captureAction.setShortcut(new QKeySequence("Alt+S"));
captureAction.addEventListener("triggered", () => {
  screenshot()
    .then((img: any) => {
      fs.writeFile("screenshot-tmp.png", img, function (err: any) {
        if (err) {
          console.log(err);
        } else {
          console.log("Screenshot has captured successfully!");

          pixmap = new QPixmap("screenshot-tmp.png").scaled(600, 480, AspectRatioMode.KeepAspectRatio);
          label.setPixmap(pixmap);

          win.show();
        }
      });
    })
    .catch((err: any) => {
      console.log(err);
    });
});

menu.addAction(captureAction);
menu.addAction(quitAction);

win.centralWidget = new QWidget();
win.setCentralWidget(win.centralWidget);
win.centralWidget.setLayout(lay);
lay.addWidget(label);

win.setWindowTitle("NCapturer");
win.resize(400, 300);

const qApp = QApplication.instance();
qApp.setQuitOnLastWindowClosed(false);

(global as any).win = win;
(global as any).systemTray = tray;
