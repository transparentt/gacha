import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import { useEffect, useState } from "react";

const menu: { [name: string]: number } = {
  メイドのオリジナルカクテル: 880,
  メイドのきまぐれごはん: 1045,
  おえかきオムライスorオムハヤシ: 1100,
  星空カレー: 825,
  ぴりカラ愛情カレー: 825,
  わんぱくサラダ: 605,
  若鳥のからあげ: 605,
  軟骨からあげ: 605,
  ポテから: 605,
  よくばりポテト: 605,
  たこの唐揚げ: 605,
  たこやき: 715,
  おうどん: 715,
  ディッシュポテト: 715,
  明太子パスタ: 715,
  ミートソーススパゲッティ: 715,
  カレーライス: 715,
  ハヤシライス: 715,
  カツカレー: 715,
  唐揚げカレー: 715,
  ソースカツ丼: 715,
  和風だしカツ丼: 715,
  特盛からあげ丼: 715,
  ビーフドリア: 715,
  チーズカレードリア: 715,
  スイーツプレート: 1430,
  きまぐれパフェ: 825,
  ショートケーキ: 660,
  チョコレートケーキ: 660,
  チーズケーキ: 660,
  バニラバニラ: 550,
  チョコチョコ: 550,
  ミックスアイス: 550,
  スペシャルセット: 2530,
  スペシャルセット気まぐれごはん: 2750,
  ホットコーヒー: 440,
  ホットココア: 440,
  ホットミルク: 440,
  アールグレイ: 660,
  セイロン: 660,
  ダージリン: 660,
  ピーチティー: 660,
  アップルティー: 660,
  イングリッシュブレックファースト: 660,
  期間限定フレーバー: 660,
  アイスコーヒー: 440,
  アイスココア: 440,
  アイスティー: 440,
  ミルク: 440,
  オレンジジュース: 440,
  アップルジュース: 440,
  ホワイトウォーター: 440,
  コーラ: 440,
  メロンソーダ: 440,
  ジンジャーエール: 440,
  ウーロン茶: 440,
  緑茶: 440,
};

const charge = 750;
const budget = 3000;

export default function Home({
  sumPrice,
  resultMenuNames,
}: {
  sumPrice: number;
  resultMenuNames: string[];
}) {
  return (
    <>
      <Head>
        <title>Charlotte ガチャ</title>
        <meta name="description" content="harlotte 3000円ガチャ" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <h2>Charlotte ガチャ</h2>

        <ul>
          <h4>設定</h4>
          <li>{"チャージ料金: " + charge + "円"}</li>
          <li>{"予算: " + budget + "円"}</li>
        </ul>

        <ul>
          <h4>ガチャ結果</h4>
          {resultMenuNames.map((menuName) => {
            return (
              <li key={menuName}>{menuName + ": " + menu[menuName] + "円"}</li>
            );
          })}
          <h5>合計: {sumPrice + charge}円</h5>
        </ul>
      </main>
    </>
  );
}

// This gets called on every request
export async function getServerSideProps() {
  let menuNames: string[] = [];
  Object.keys(menu).forEach((key) => {
    menuNames.push(key);
  });

  let sumPrice = 0;
  let resultMenuNames: string[] = [];

  console.log("############");
  while (true) {
    let candidateMenuNames: string[] = [];

    for (const candidateName of menuNames) {
      const candidatePrice = menu[candidateName];
      if (budget - charge > sumPrice + candidatePrice) {
        candidateMenuNames.push(candidateName);
      }
    }

    if (candidateMenuNames.length > 0) {
      let menuName =
        candidateMenuNames[
          Math.floor(Math.random() * candidateMenuNames.length)
        ];
      const price = menu[menuName];

      console.log(menuName, price);

      if (budget - charge > sumPrice + price) {
        sumPrice += price;
        resultMenuNames.push(menuName);
      }
    } else {
      break;
    }
  }
  // Pass data to the page via props
  return { props: { sumPrice, resultMenuNames } };
}
