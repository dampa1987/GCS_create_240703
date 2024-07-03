using System.Collections;
using System.Collections.Generic;
using UnityEngine;

/// <summary>
/// コインの挙動
/// </summary>
public class CoinObject : MonoBehaviour
{
	//Update処理は毎回呼ばれる
	void Update()
	{
		//一定以下の高さになった場合
		if (transform.localPosition.y <= -7)
		{
			//オブジェクト削除
			Destroy(gameObject);
		}
	}
}
