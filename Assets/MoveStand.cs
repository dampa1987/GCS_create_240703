using System.Collections;
using System.Collections.Generic;
using UnityEngine;

/// <summary>
/// 台座の移動
/// </summary>
public class MoveStand : MonoBehaviour
{
	//奥に移動
	private bool _isBack = false;

	//Update処理は毎回呼ばれる
	void Update()
	{
		//台の位置
		var position = transform.localPosition;
		if (_isBack)
		{
			//奥に移動
			position.z += Time.deltaTime * 2;
		}
		else
		{
			//手前に移動
			position.z -= Time.deltaTime * 2;
		}
		if (position.z >= 7)
		{
			//ある程度奥に行ったら奥に行くフラグをオフ
			_isBack = false;
		}
		else if (position.z <= 4)
		{
			//ある程度手前なら奥に行くフラグをオン
			_isBack = true;
		}
		//移動位置を適応
		transform.localPosition = position;
	}
}