package com.nfce_rn

import android.content.Intent
import android.os.Bundle
import android.util.Log
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.tecnospeed.nfce.core.TspdNFCe

class MainActivity : ReactActivity() {
  private lateinit var launcher: ActivityResultLauncher<Intent>
  private lateinit var nfce: TspdNFCe;

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    nfce = TspdNFCe();

    Log.d("NFCeMain", "Instanciado componente NFC-e")

    launcher = registerForActivityResult(ActivityResultContracts.StartActivityForResult(), nfce::onResult)
  }

  fun getLauncher(): ActivityResultLauncher<Intent> {
    return launcher;
  }

  fun getNFCe(): TspdNFCe {
    nfce.setLauncher(this.getLauncher());
    nfce.setAppPackageName("com.nfce_rn");

    return nfce;
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "nfce_rn"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
