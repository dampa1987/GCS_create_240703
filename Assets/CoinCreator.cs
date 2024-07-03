using System.Collections;
using System.Collections.Generic;
using UnityEngine;

/// <summary>
/// コインの作成を行う
/// </summary>
public class CoinCreator : MonoBehaviour
{
	//コピーする元となるコイン
	[SerializeField] private GameObject _originalCoin;

	//Update処理は毎回呼ばれる
	void Update()
	{
		//マウスクリックをした
		if (Input.GetMouseButtonDown(0))
		{
			//クリック地点からレイを作成する
			var ray = Camera.main.ScreenPointToRay(Input.mousePosition);
			RaycastHit hit;
			//レイの先にオブジェクトがある
			if (Physics.Raycast(ray, out hit, 500))
			{
				//コインの生成位置の算出
				var distance = Vector3.Distance(Camera.main.transform.position, hit.point);
				//クリック地点
				var mousePosition = new Vector3(Input.mousePosition.x, Input.mousePosition.y, distance);
				//クリック地点をワールド座標に変換
				var position = Camera.main.ScreenToWorldPoint(mousePosition);
				//少し高い位置に生成
				position.y += 5;
				//コインの生成
				var objectBase = (GameObject)Instantiate(_originalCoin);
				//算出した位置を設定
				objectBase.gameObject.transform.localPosition = position;
				//有効化する
				objectBase.gameObject.SetActive(true);
			}
		}
	}
}
