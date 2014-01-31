package ti.drawerdemo;

import org.appcelerator.titanium.ITiAppInfo;
import org.appcelerator.titanium.TiApplication;
import org.appcelerator.titanium.TiProperties;
import org.appcelerator.kroll.common.Log;

/* GENERATED CODE
 * Warning - this class was generated from your application's tiapp.xml
 * Any changes you make here will be overwritten
 */
public final class DrawerdemoAppInfo implements ITiAppInfo
{
	private static final String LCAT = "AppInfo";
	
	public DrawerdemoAppInfo(TiApplication app) {
		TiProperties properties = app.getSystemProperties();
		TiProperties appProperties = app.getAppProperties();
					
					properties.setString("ti.ui.defaultunit", "system");
					appProperties.setString("ti.ui.defaultunit", "system");
					
					properties.setString("ti.deploytype", "test");
					appProperties.setString("ti.deploytype", "test");
	}
	
	public String getId() {
		return "ti.drawerdemo";
	}
	
	public String getName() {
		return "DrawerDemo";
	}
	
	public String getVersion() {
		return "1.0";
	}
	
	public String getPublisher() {
		return "ralcocer";
	}
	
	public String getUrl() {
		return "http://";
	}
	
	public String getCopyright() {
		return "2013 by ralcocer";
	}
	
	public String getDescription() {
		return "not specified";
	}
	
	public String getIcon() {
		return "appicon.png";
	}
	
	public boolean isAnalyticsEnabled() {
		return true;
	}
	
	public String getGUID() {
		return "7c42b821-600a-4212-98b9-bc5775968dde";
	}
	
	public boolean isFullscreen() {
		return false;
	}
	
	public boolean isNavBarHidden() {
		return false;
	}
}
